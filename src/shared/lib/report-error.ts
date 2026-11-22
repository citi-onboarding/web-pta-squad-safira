export type ErrorContext = Readonly<Record<string, unknown>>;
export type ErrorReporter = (
  error: unknown,
  context?: ErrorContext,
) => void | Promise<void>;

const consoleReporter: ErrorReporter = (error, context) => {
  console.error("Unhandled application error", { error, context });
};

let activeReporter = consoleReporter;

export function setErrorReporter(reporter: ErrorReporter) {
  activeReporter = reporter;

  return () => {
    activeReporter = consoleReporter;
  };
}

export function reportError(error: unknown, context?: ErrorContext) {
  return activeReporter(error, context);
}
