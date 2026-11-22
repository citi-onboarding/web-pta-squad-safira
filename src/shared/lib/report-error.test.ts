import { afterEach, describe, expect, it, vi } from "vitest";

import { reportError, setErrorReporter } from "./report-error";

describe("reportError", () => {
  let restoreReporter: (() => void) | undefined;

  afterEach(() => restoreReporter?.());

  it("delegates to the configured reporter", async () => {
    const reporter = vi.fn();
    restoreReporter = setErrorReporter(reporter);
    const error = new Error("Failure");

    await reportError(error, { boundary: "app" });

    expect(reporter).toHaveBeenCalledWith(error, { boundary: "app" });
  });

  it("falls back to the console reporter after restoration", async () => {
    const reporter = vi.fn();
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    restoreReporter = setErrorReporter(reporter);
    restoreReporter();

    await reportError("failure");

    expect(consoleError).toHaveBeenCalledWith("Unhandled application error", {
      error: "failure",
      context: undefined,
    });
    consoleError.mockRestore();
    restoreReporter = undefined;
  });
});
