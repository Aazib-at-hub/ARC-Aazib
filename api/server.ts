import type { VercelRequest, VercelResponse } from "@vercel/node";

// Import the TanStack Start server handler built by `npm run build`
let handler: { fetch: (req: Request) => Promise<Response> } | null = null;

async function getHandler() {
  if (!handler) {
    // The built server entry exports a fetch handler
    handler = await import("../dist/server/server.js" as string).then(
      (m) => m.default ?? m,
    );
  }
  return handler!;
}

export default async function serverHandler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const h = await getHandler();

  const url = `https://${req.headers.host}${req.url}`;
  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? JSON.stringify(req.body)
      : undefined;

  const webRequest = new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body,
  });

  const response = await h.fetch(webRequest);
  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  const text = await response.text();
  res.send(text);
}
