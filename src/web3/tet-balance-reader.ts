/** Mockable read contract, not an HTTP transport or an injected wallet provider. */
export interface EthereumReadClient {
  request(request: ReadRequest): Promise<unknown>;
}

export type ReadRequest =
  | { readonly method: "eth_chainId"; readonly params: readonly [] }
  | { readonly method: "eth_call"; readonly params: readonly [
      { readonly to: string; readonly data: string }, "latest",
    ] };

export const TET_CONTRACT = "0x68A47Fe1CF42eBa4a030a10CD4D6a1031Ca3CA0a";
export const TET_DECIMALS = 8;

type Account = `0x${string}`;
type UnavailableReason = "no_account" | "invalid_account" | "selection_changed" |
  "rpc_failure" | "invalid_response" | "unexpected_metadata";
export type BalanceState =
  | { readonly kind: "unavailable"; readonly account: Account | null; readonly reason: UnavailableReason }
  | { readonly kind: "loading"; readonly account: Account }
  | { readonly kind: "wrong_chain"; readonly account: Account; readonly expectedChainId: 1n; readonly actualChainId: bigint }
  | { readonly kind: "zero_balance"; readonly account: Account; readonly units: 0n; readonly decimals: 8 }
  | { readonly kind: "balance"; readonly account: Account; readonly units: bigint; readonly decimals: 8 };

function exactMatch(value: unknown, pattern: RegExp): value is string {
  return typeof value === "string" && pattern.exec(value)?.[0] === value;
}

function quantity(value: unknown): bigint | null {
  return exactMatch(value, /^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/) ? BigInt(value) : null;
}

function uint256(value: unknown): bigint | null {
  return exactMatch(value, /^0x[0-9a-fA-F]{64}$/) ? BigInt(value) : null;
}

/** Wallet events invalidate selection; only the separately configured client reads. */
export function createTetBalanceReader(httpReader: EthereumReadClient) {
  let generation = 0;
  let state: BalanceState = { kind: "unavailable", account: null, reason: "no_account" };

  async function selectAccount(selected: string | null): Promise<void> {
    const requestGeneration = ++generation;
    if (selected === null || !exactMatch(selected, /^0x[0-9a-fA-F]{40}$/)) {
      state = { kind: "unavailable", account: null, reason: selected === null ? "no_account" : "invalid_account" };
      return;
    }
    const account = selected.toLowerCase() as Account;
    state = { kind: "loading", account };
    const current = () => requestGeneration === generation;
    const unavailable = (reason: UnavailableReason) => {
      state = { kind: "unavailable", account, reason };
    };
    try {
      const chainId = quantity(await httpReader.request({ method: "eth_chainId", params: [] }));
      if (!current()) return;
      if (chainId === null) return unavailable("invalid_response");
      if (chainId !== 1n) {
        state = { kind: "wrong_chain", account, expectedChainId: 1n, actualChainId: chainId };
        return;
      }
      const decimals = uint256(await httpReader.request({
        method: "eth_call", params: [{ to: TET_CONTRACT, data: "0x313ce567" }, "latest"],
      }));
      if (!current()) return;
      if (decimals === null) return unavailable("invalid_response");
      if (decimals !== BigInt(TET_DECIMALS)) return unavailable("unexpected_metadata");
      const units = uint256(await httpReader.request({
        method: "eth_call", params: [{ to: TET_CONTRACT, data: `0x70a08231${account.slice(2).padStart(64, "0")}` }, "latest"],
      }));
      if (!current()) return;
      if (units === null) return unavailable("invalid_response");
      state = units === 0n
        ? { kind: "zero_balance", account, units: 0n, decimals: TET_DECIMALS }
        : { kind: "balance", account, units, decimals: TET_DECIMALS };
    } catch {
      if (current()) unavailable("rpc_failure");
    }
  }

  function invalidate(): void {
    generation++;
    state = { kind: "unavailable", account: state.account, reason: "selection_changed" };
  }

  return { selectAccount, invalidate, getState: (): BalanceState => state };
}
