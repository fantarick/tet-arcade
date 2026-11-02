import { StrictMode, act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "../src/App";

// 450 ms initial pause + 2 * (560 ms cell on + 240 ms gap).
const ROUND_ONE_PLAYBACK_MS = 2050;

function renderApp() {
  return render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

function cells() {
  return screen.getAllByRole<HTMLButtonElement>("button", {
    name: /^Cell \d+, row \d+, column \d+$/,
  });
}

function advance(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });
}

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("Pulse Grid UI playback", () => {
  it("keeps input locked until the sequence finishes, including Strict Mode effect replay", () => {
    renderApp();

    expect(cells()).toHaveLength(25);
    expect(cells().every((cell) => cell.disabled)).toBe(true);

    advance(ROUND_ONE_PLAYBACK_MS - 1);
    expect(cells().every((cell) => cell.disabled)).toBe(true);

    advance(1);
    expect(cells().every((cell) => !cell.disabled)).toBe(true);
    expect(screen.getByRole("status").textContent).toContain("Your turn");

    // An orphaned Strict Mode timer would incorrectly restart or advance.
    advance(ROUND_ONE_PLAYBACK_MS);
    expect(cells().every((cell) => !cell.disabled)).toBe(true);
    expect(screen.getByRole("status").textContent).toContain("Your turn");
  });

  it("cleans up the previous round timers when New game is pressed during playback", () => {
    renderApp();

    advance(850);
    fireEvent.click(screen.getByRole("button", { name: "New game" }));
    expect(cells().every((cell) => cell.disabled)).toBe(true);

    // This crosses the first game's scheduled finish time (2050 ms).
    advance(1200);
    expect(cells().every((cell) => cell.disabled)).toBe(true);

    // Only the new game's playback should unlock input.
    advance(850);
    expect(cells().every((cell) => !cell.disabled)).toBe(true);
  });

  it("shows an accessible ordered guide and scores a correctly repeated sequence", () => {
    renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Show sequence guide" }));

    const guide = screen.getByText(/Cells in order:/);
    const matches = [...(guide.textContent ?? "").matchAll(/row (\d+), column (\d+)/g)];
    expect(matches).toHaveLength(2);

    // Buttons are disabled during playback, even when the optional guide is open.
    expect(cells().every((cell) => cell.disabled)).toBe(true);
    advance(ROUND_ONE_PLAYBACK_MS);

    for (const [, row, column] of matches) {
      const index = (Number(row) - 1) * 5 + Number(column);
      fireEvent.click(screen.getByRole("button", {
        name: new RegExp("^Cell " + index + ","),
      }));
    }

    expect(screen.getByText("02")).toBeTruthy();
    expect(screen.getAllByText("10")).toHaveLength(2);
    expect(cells().every((cell) => cell.disabled)).toBe(true);
  });

  it("releases pending timers when the component unmounts", () => {
    const { unmount } = renderApp();
    const pendingBeforeUnmount = vi.getTimerCount();
    expect(pendingBeforeUnmount).toBeGreaterThan(0);
    unmount();
    // React/jsdom may retain an unrelated scheduler timer. All playback
    // timers must be removed; their removal decreases the active count.
    expect(vi.getTimerCount()).toBeLessThan(pendingBeforeUnmount);
  });
});
