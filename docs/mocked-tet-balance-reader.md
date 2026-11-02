# Mocked TET balance reader

This example implements the narrow, provider-neutral task in [issue #12](https://github.com/fantarick/tet-arcade/issues/12), related to [issue #6](https://github.com/fantarick/tet-arcade/issues/6). It does not connect a wallet, supply an HTTP transport, or integrate the example into the playable game. Free play remains independent of Web3.

## Contract and state

[`createTetBalanceReader`](../src/web3/tet-balance-reader.ts) accepts an `EthereumReadClient`: a separately configured Ethereum Mainnet read client whose `request` resolves to the JSON-RPC **result value** and rejects on transport or JSON-RPC errors. The interface only exposes `eth_chainId` and read-only `eth_call`, not signing, account connection, transactions, or approvals.

`selectAccount(address | null)` selects an address and starts a read. No selected account means no RPC calls. For a valid address, the controller serially:

1. Requires a canonical `eth_chainId` result equal to `0x1` before any token query.
2. Reads `decimals()` on the repository's intended [TET contract](../README.md#blockchain-scope) and requires the configured value `8`.
3. Reads `balanceOf(address)` on that same contract. Both contract results must be exactly one ABI-encoded uint256 word.

The result is available through `getState()`:

| `kind` | Meaning |
| --- | --- |
| `unavailable` | No/invalid selection, invalidated selection, failed RPC, malformed response, or unexpected token metadata; `reason` distinguishes these cases |
| `loading` | A read for the selected account is pending |
| `wrong_chain` | The configured read client reports a chain other than Mainnet; no token query follows |
| `zero_balance` | The read succeeded and returned exactly `0n` raw token units |
| `balance` | The read succeeded and returned positive `bigint` units with `8` decimals |

A request error never becomes a confirmed zero. No floating-point balance calculation or eligibility threshold is included. A selected address is not proof that the user owns it.

## Offline usage

This example uses fake values only. No service account, wallet, provider URL, or credentials are needed:

```ts
import { createTetBalanceReader } from "../src/web3/tet-balance-reader.ts";

const word = (value: bigint) => `0x${value.toString(16).padStart(64, "0")}`;
const replies: unknown[] = ["0x1", word(8n), word(0n)];
const balances = createTetBalanceReader({
  async request() { return replies.shift(); },
});

await balances.selectAccount("0x1111111111111111111111111111111111111111");
console.log(balances.getState()); // zero_balance, units: 0n, decimals: 8
```

Wallet **selection events** belong to a separate integration, not to the read client. Its event handlers can delegate as follows:

```ts
const onAccountsChanged = (accounts: readonly string[]) => {
  void balances.selectAccount(accounts[0] ?? null);
};
const onChainChanged = () => balances.invalidate();
const onDisconnect = () => { void balances.selectAccount(null); };
```

The application owns event subscriptions and must remove them when unmounting. No handler redirects the configured HTTP reader to the injected wallet provider. A wallet can be disconnected or on another chain without changing where Mainnet reads go. A chain change clears the displayed result; the application can explicitly refresh the selected account through the same configured Mainnet reader.

Each selection or invalidation advances a generation. Old responses and old rejections cannot replace newer state, even if they arrive after another account has completed. `selectAccount` resolves with no payload: after awaiting it, consume the controller's **current** state rather than capturing a stale per-request balance.

## Tests and boundaries

```bash
npm ci --ignore-scripts
npm test
npm run typecheck
```

The normal test command includes deferred-promise scenarios in [`tests/web3/tet-balance-reader.test.mjs`](../tests/web3/tet-balance-reader.test.mjs): account switches, disconnects and chain changes during each read phase, wrong-chain rejection, malformed data, RPC failures, and exact zero/positive units. A hostile fake `window.ethereum` verifies that the adapter never falls back to an injected provider.

This is a mock-driven controller, not a production transport or a complete M2 wallet UI. Invalidation ignores stale completions; it does not cancel requests already owned by the supplied client. A future real HTTP client needs its own request timeouts, response and concurrency bounds, error handling, endpoint/privacy review, and any supported cancellation. No retries or live calls are implemented here. Reads use `latest`, not an atomic multi-call snapshot or independently verified chain state.

A real balance request reveals the selected account and token contract to the chosen RPC service, which may also see the caller's IP address. This contribution adds no analytics, backend, service dependency, credentials, browser integration, or new packages. There is no wallet signing, custody, spending, deployment, Happi access, or financial authorization. The repository's reported contract and decimals are used as expectations; these mocked tests do not independently verify real token metadata or holdings.
