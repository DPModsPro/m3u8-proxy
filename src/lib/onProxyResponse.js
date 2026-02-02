import url from "node:url";
import withCORS from "./withCORS.js";

export default function onProxyResponse(proxy, proxyReq, proxyRes, req, res) {
  const requestState = req.corsAnywhereRequestState;
  const statusCode = proxyRes.statusCode;

  if (statusCode >= 300 && statusCode < 400 && proxyRes.headers.location) {
    // Handle Redirects if needed (Simplified for this version)
  }

  delete proxyRes.headers["set-cookie"];
  delete proxyRes.headers["set-cookie2"];

  withCORS(proxyRes.headers, req);
  return true;
}
