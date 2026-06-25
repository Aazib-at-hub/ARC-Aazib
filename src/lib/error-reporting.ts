export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  // Simple generic error logger – replace with your own analytics if desired
  console.error("Error captured:", error, context);
}
