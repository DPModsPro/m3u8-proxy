import withCORS from "./withCORS.js";

export default function onProxyResponse(proxy, proxyReq, proxyRes, req, res) {
  // Removing sensitive cookies
  delete proxyRes.headers["set-cookie"];
  delete proxyRes.headers["set-cookie2"];
  
  // Apply CORS to the proxied response
  const headers = withCORS(proxyRes.headers, req);
  
  // If headers weren't sent, apply them
  if (!res.headersSent) {
    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res);
  }
}
