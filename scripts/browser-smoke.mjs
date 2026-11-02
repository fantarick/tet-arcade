/**
 * Minimal real-Chromium smoke test for Pulse Grid on GitHub-hosted CI.
 * No wallet, RPC, external network endpoint, deployment or browser-test service.
 *
 * Requires Playwright to be installed only in the ephemeral CI job.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";
import { chromium } from "playwright";

const HOST = "127.0.0.1";
const PORT = 5173;
const ORIGIN = "http://" + HOST + ":" + PORT;
const STARTUP_LIMIT_MS = 20_000;
const PLAYBACK_LIMIT_MS = 8_000;

function recordSequence(text) {
  const cells = [...text.matchAll(/row (\d+), column (\d+)/g)].map((match) => {
    const row = Number(match[1]);
    const column = Number(match[2]);
    assert.ok(row >= 1 && row <= 5 && column >= 1 && column <= 5);
    return (row - 1) * 5 + column - 1;
  });
  assert.equal(cells.length, 2, "the first sequence must contain two cells");
  return cells;
}

async function waitForServer(process) {
  const started = Date.now();
  while (Date.now() - started < STARTUP_LIMIT_MS) {
    if (process.exitCode !== null) {
      throw new Error("Vite exited before the browser could connect");
    }
    try {
      const response = await fetch(ORIGIN, { signal: AbortSignal.timeout(900) });
      if (response.ok) return;
    } catch {
      // Startup can take a moment on a fresh CI runner.
    }
    await pause(150);
  }
  throw new Error("Timed out waiting for the localhost-only Vite server");
}

async function main() {
  const vite = spawn(
    process.execPath,
    ["./node_modules/vite/bin/vite.js", "--host", HOST, "--port", String(PORT), "--strictPort"],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  let serverOutput = "";
  for (const stream of [vite.stdout, vite.stderr]) {
    stream.on("data", (chunk) => {
      serverOutput = (serverOutput + chunk.toString()).slice(-4000);
    });
  }

  let browser;
  try {
    await waitForServer(vite);
    browser = await chromium.launch({ headless: true });

    const mobile = await browser.newContext({
      viewport: { width: 320, height: 720 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
    });
    const page = await mobile.newPage();
    const pageErrors = [];
    const externalRequests = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("request", (request) => {
      if (!request.url().startsWith(ORIGIN + "/")) {
        externalRequests.push(request.url());
      }
    });

    await page.goto(ORIGIN, { waitUntil: "networkidle" });
    assert.match(await page.title(), /TET Arcade.*Pulse Grid/);
    const cells = page.locator(".pulse-cell");
    assert.equal(await cells.count(), 25, "the grid must contain 25 cells");
    assert.equal(await cells.filter({ enabled: true }).count(), 0, "cells must be locked during playback");
    assert.equal(await page.locator(".phase-indicator.phase-playback").count(), 1);

    // An explicitly optional text guide permits reproducible interaction even
    // when the seed and sequence are created privately by the browser.
    await page.getByRole("button", { name: "Show sequence guide" }).click();
    const initial = recordSequence(
      await page.locator(".sequence-guide p").nth(1).innerText(),
    );

    await page.locator(".phase-indicator.phase-input").waitFor({
      state: "visible",
      timeout: PLAYBACK_LIMIT_MS,
    });
    assert.equal(await cells.filter({ enabled: true }).count(), 25);
    await cells.nth(initial[0]).click();
    assert.match(await page.locator(".game-status").innerText(), /Cell 2 of 2/);
    await cells.nth(initial[1]).click();

    assert.equal(await page.locator(".scoreboard .stat-value").nth(0).innerText(), "02");
    assert.equal(await page.locator(".scoreboard .stat-value").nth(1).innerText(), "10");
    assert.equal(await cells.filter({ enabled: true }).count(), 0, "next round must lock input");

    // Restart before playback finishes. The old round must never unlock input
    // or overwrite the new attempt.
    await page.getByRole("button", { name: "New game" }).click();
    assert.equal(await page.locator(".scoreboard .stat-value").nth(0).innerText(), "01");
    assert.equal(await page.locator(".scoreboard .stat-value").nth(1).innerText(), "0");
    assert.equal(await page.locator(".scoreboard .stat-value").nth(2).innerText(), "10");
    assert.equal(await cells.filter({ enabled: true }).count(), 0);
    const restarted = recordSequence(
      await page.locator(".sequence-guide p").nth(1).innerText(),
    );
    await page.locator(".phase-indicator.phase-input").waitFor({
      state: "visible",
      timeout: PLAYBACK_LIMIT_MS,
    });
    await cells.nth((restarted[0] + 1) % 25).click();
    await page.locator(".phase-indicator.phase-lost").waitFor();
    assert.match(await page.locator(".game-status").innerText(), /Game over/);
    assert.equal(await cells.filter({ enabled: true }).count(), 0);
    await page.getByRole("button", { name: "Try again" }).click();
    assert.equal(await page.locator(".phase-indicator.phase-playback").count(), 1);

    // CSS/layout checks across mobile, tablet and desktop-sized viewports.
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      const geometry = await page.evaluate(() => ({
        inner: window.innerWidth,
        scroll: document.documentElement.scrollWidth,
        board: document.querySelector(".pulse-grid")?.getBoundingClientRect().toJSON(),
      }));
      assert.ok(
        geometry.scroll <= geometry.inner + 1,
        "horizontal page overflow at " + width + "px: " + JSON.stringify(geometry),
      );
      assert.ok(geometry.board && geometry.board.width > 200);
      assert.ok(geometry.board.left >= 0 && geometry.board.right <= geometry.inner + 1);
    }

    // Check keyboard activation and reduced-motion CSS in a desktop context.
    const desktop = await browser.newContext({
      viewport: { width: 1280, height: 850 },
      reducedMotion: "reduce",
    });
    const keyboardPage = await desktop.newPage();
    keyboardPage.on("pageerror", (error) => pageErrors.push(error.message));
    keyboardPage.on("request", (request) => {
      if (!request.url().startsWith(ORIGIN + "/")) {
        externalRequests.push(request.url());
      }
    });
    await keyboardPage.goto(ORIGIN);
    await keyboardPage.getByRole("button", { name: "Show sequence guide" }).click();
    const keyboardSequence = recordSequence(
      await keyboardPage.locator(".sequence-guide p").nth(1).innerText(),
    );
    await keyboardPage.locator(".phase-indicator.phase-input").waitFor({
      state: "visible",
      timeout: PLAYBACK_LIMIT_MS,
    });
    assert.equal(
      await keyboardPage.locator(".pulse-cell").first().evaluate((el) => el === document.activeElement),
      true,
      "the first cell should receive focus when input unlocks",
    );
    await keyboardPage.keyboard.press("Tab");
    assert.equal(
      await keyboardPage.locator(".pulse-cell").nth(1).evaluate((el) => el === document.activeElement),
      true,
      "Tab should move focus to the next cell",
    );
    await keyboardPage.locator(".pulse-cell").nth(keyboardSequence[0]).focus();
    await keyboardPage.keyboard.press("Enter");
    await keyboardPage.locator(".pulse-cell").nth(keyboardSequence[1]).focus();
    await keyboardPage.keyboard.press("Space");
    assert.equal(await keyboardPage.locator(".scoreboard .stat-value").nth(1).innerText(), "10");
    assert.equal(
      await keyboardPage.locator(".pulse-cell").first().evaluate((el) => getComputedStyle(el).transitionDuration),
      "0s",
      "reduced-motion mode should disable cell transitions",
    );

    assert.deepEqual(pageErrors, [], "browser must have no uncaught JavaScript exceptions");
    assert.deepEqual(externalRequests, [], "gameplay should not request external services");

    await desktop.close();
    await mobile.close();
    console.log("PASS: Chromium gameplay, restart, keyboard, reduced motion, 4 responsive widths, no external requests");
  } catch (error) {
    console.error("FAIL: Pulse Grid Chromium smoke test:", error);
    if (serverOutput) console.error("Vite diagnostics:", serverOutput);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    vite.kill("SIGTERM");
  }
}

await main();
