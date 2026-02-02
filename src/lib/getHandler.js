import { isValidHostName } from "./isValidHostName.js";
import { getProxyForUrl } from "proxy-from-env";
import parseURL from "./parseURL.js";
import proxyM3U8 from "./proxyM3U8.js";
import { proxyTs } from "./proxyTS.js";
import withCORS from "./withCORS.js";

export default function getHandler(options, proxy) {
  const corsAnywhere = {
    maxRedirects: 5,
    originBlacklist: options.originBlacklist || [],
    originWhitelist: options.originWhitelist || [],
    corsMaxAge: 0,
  };

  return function (req, res) {
    req.corsAnywhereRequestState = {
      getProxyForUrl: getProxyForUrl,
      maxRedirects: corsAnywhere.maxRedirects,
      corsMaxAge: corsAnywhere.corsMaxAge,
    };

    if (req.method === "OPTIONS") {
      res.writeHead(200, withCORS({}, req));
      res.end();
      return;
    }

    const uri = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    
    // Custom Endpoints
    if (uri.pathname === "/m3u8-proxy") {
      const url = uri.searchParams.get("url");
      const headers = JSON.parse(uri.searchParams.get("headers") || "{}");
      return proxyM3U8(url || "", headers, res);
    } 
    
    if (uri.pathname === "/ts-proxy") {
      const url = uri.searchParams.get("url");
      const headers = JSON.parse(uri.searchParams.get("headers") || "{}");
      return proxyTs(url || "", headers, req, res);
    }

    // Standard Proxy Logic
    const location = parseURL(req.url.slice(1));
    if (!location || !isValidHostName(location.hostname)) {
      res.writeHead(404, withCORS({}, req));
      res.end("Invalid Target or Route");
      return;
    }

    res.writeHead(403);
    res.end("Generic proxying disabled. Use /m3u8-proxy");
  };
}
