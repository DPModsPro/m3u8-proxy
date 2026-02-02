import getHandler from "./getHandler.js";
import httpProxy from "http-proxy";
import http from "node:http";
import https from "node:https";

export default function createServer(options) {
  options = options || {};

  const httpProxyOptions = {
    xfwd: true,
    secure: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0",
  };

  if (options.httpProxyOptions) {
    Object.keys(options.httpProxyOptions).forEach(function (option) {
      httpProxyOptions[option] = options.httpProxyOptions[option];
    });
  }

  const proxyServer = httpProxy.createProxyServer(httpProxyOptions);
  const requestHandler = getHandler(options, proxyServer);

  const server = options.httpsOptions
    ? https.createServer(options.httpsOptions, requestHandler)
    : http.createServer(requestHandler);

  proxyServer.on("error", function (err, req, res) {
    if (res.headersSent) return;
    res.writeHead(502, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
    res.end("Proxy Error: " + err.message);
  });

  return server;
}
