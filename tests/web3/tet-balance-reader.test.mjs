import assert from "node:assert/strict";
import test from "node:test";
import { createTetBalanceReader, TET_CONTRACT } from "../../src/web3/tet-balance-reader.ts";

const A = "0x1111111111111111111111111111111111111111";
const B = "0x2222222222222222222222222222222222222222";
const word = (n) => `0x${BigInt(n).toString(16).padStart(64, "0")}`;
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
function mock(responses) {
  const calls = [];
  return {
    calls,
    request(request) {
      calls.push(request);
      assert.ok(calls.length <= responses.length, "unexpected RPC");
      const next = responses[calls.length - 1];
      return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
    },
  };
}

// An injected provider is deliberately hostile: the adapter must never touch it.
test("an installed disconnected wallet on another chain cannot redirect Mainnet reads", async () => {
  const previousWindow = globalThis.window;
  let walletCalls = 0;
  globalThis.window = { ethereum: { chainId: "0x38", request() { walletCalls++; throw new Error("wrong reader"); } } };
  try {
    const http = mock(["0x1", word(8), word(12)]);
    const controller = createTetBalanceReader(http);
    await controller.selectAccount(null);
    assert.equal(http.calls.length, 0, "disconnected selection must not read any holdings");
    assert.equal(controller.getState().kind, "unavailable");
    await controller.selectAccount(A);
    assert.equal(controller.getState().kind, "balance");
    assert.equal(walletCalls, 0);
    assert.deepEqual(http.calls[0], { method: "eth_chainId", params: [] });
    assert.deepEqual(http.calls[1], { method: "eth_call", params: [{ to: TET_CONTRACT, data: "0x313ce567" }, "latest"] });
    assert.deepEqual(http.calls[2], { method: "eth_call", params: [{ to: TET_CONTRACT, data: `0x70a08231${A.slice(2).padStart(64, "0")}` }, "latest"] });
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test("wrong HTTP chain stops before either token query", async () => {
  const http = mock(["0x38"]), controller = createTetBalanceReader(http);
  await controller.selectAccount(A);
  assert.deepEqual(controller.getState(), { kind: "wrong_chain", account: A, expectedChainId: 1n, actualChainId: 56n });
  assert.equal(http.calls.length, 1);
});

for (const phase of [0, 1, 2]) {
  test(`an RPC failure at phase ${phase} is unavailable, never zero`, async () => {
    const steps = ["0x1", word(8), word(0)];steps[phase] = new Error("synthetic RPC failure");
    const http = mock(steps), controller = createTetBalanceReader(http);
    await controller.selectAccount(A);
    assert.deepEqual(controller.getState(), { kind: "unavailable", account: A, reason: "rpc_failure" });
    assert.equal(http.calls.length, phase + 1);
  });
}

for (const units of [0n, 1n, 9007199254740993n, (1n << 256n) - 1n]) {
  test(`zero and positive uint256 units remain exact: ${units}`, async () => {
    const controller = createTetBalanceReader(mock(["0x1", word(8), word(units)]));
    await controller.selectAccount(A);
    assert.deepEqual(controller.getState(), { kind: units === 0n ? "zero_balance" : "balance", account: A, units, decimals: 8 });
  });
}

for (const [phase, invalid] of [[0, "0x01"], [0, "0x1\n"], [0, { result: "0x1" }], [1, "0x8"], [1, word(18)], [2, "0x"], [2, -1], [2, `${word(0)}\n`]]) {
  test(`invalid data at phase ${phase}: ${JSON.stringify(invalid)} cannot confirm a zero`, async () => {
    const steps = ["0x1", word(8), word(0)];steps[phase] = invalid;
    const http = mock(steps), controller = createTetBalanceReader(http);
    await controller.selectAccount(A);
    assert.equal(controller.getState().kind, "unavailable");
    assert.equal(http.calls.length, phase + 1);
  });
}

for (const selected of ["", "0x123", `${A}\n`, "not-an-account"]) {
  test(`invalid account ${JSON.stringify(selected)} never reaches the reader`, async () => {
    const http = mock([]), controller = createTetBalanceReader(http);
    await controller.selectAccount(selected);
    assert.equal(controller.getState().reason, "invalid_account");
    assert.equal(http.calls.length, 0);
  });
}

test("account B wins while account A's token result is pending", async () => {
  const oldBalance = deferred(), entered = deferred();
  const http = mock(["0x1", word(8), oldBalance.promise, "0x1", word(8), word(20)]);
  const request = http.request.bind(http);
  http.request = (req) => { const pending = request(req);if (http.calls.length === 3) entered.resolve();return pending; };
  const controller = createTetBalanceReader(http);
  const oldRead = controller.selectAccount(A);await entered.promise;
  await controller.selectAccount(B);
  oldBalance.resolve(word(99));await oldRead;
  assert.deepEqual(controller.getState(), { kind: "balance", account: B, units: 20n, decimals: 8 });
});

for (const event of ["disconnect", "chainChanged"]) {
  for (const pendingPhase of [0, 1, 2]) {
    test(`${event} invalidates a pending phase ${pendingPhase} without further token reads`, async () => {
      const delayed = deferred(), entered = deferred();
      const steps = ["0x1", word(8), word(99)];steps[pendingPhase] = delayed.promise;
      const http = mock(steps), original = http.request.bind(http);
      http.request = (req) => { const result = original(req);if (http.calls.length === pendingPhase + 1) entered.resolve();return result; };
      const controller = createTetBalanceReader(http), pending = controller.selectAccount(A);
      await entered.promise;
      if (event === "disconnect") await controller.selectAccount(null);
      else controller.invalidate();
      const stateAfterEvent = controller.getState();
      delayed.resolve(["0x1", word(8), word(99)][pendingPhase]);await pending;
      assert.deepEqual(controller.getState(), stateAfterEvent);
      assert.equal(stateAfterEvent.kind, "unavailable");
      assert.equal(http.calls.length, pendingPhase + 1);
    });
  }
}

test("a rejected stale request cannot overwrite the newer account", async () => {
  const oldChain = deferred(), http = mock([oldChain.promise, "0x1", word(8), word(7)]);
  const controller = createTetBalanceReader(http), oldRead = controller.selectAccount(A);
  await controller.selectAccount(B);
  oldChain.reject(new Error("stale failure"));await oldRead;
  assert.deepEqual(controller.getState(), { kind: "balance", account: B, units: 7n, decimals: 8 });
});

test("A to B to A does not revive the first A response", async () => {
  const oldBalance = deferred(), entered = deferred();
  const http = mock(["0x1", word(8), oldBalance.promise, "0x1", word(8), word(20), "0x1", word(8), word(7)]);
  const original = http.request.bind(http);
  http.request = (req) => { const pending = original(req);if (http.calls.length === 3) entered.resolve();return pending; };
  const controller = createTetBalanceReader(http), oldRead = controller.selectAccount(A);
  await entered.promise;assert.equal(controller.getState().kind, "loading");
  await controller.selectAccount(B);await controller.selectAccount(A);
  oldBalance.resolve(word(99));await oldRead;
  assert.deepEqual(controller.getState(), { kind: "balance", account: A, units: 7n, decimals: 8 });
});
