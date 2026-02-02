import { isValidHostName } from "./isValidHostName.js";
import parseURL from "./parseURL.js";
import proxyM3U8 from "./proxyM3U8.js";
import { proxyTs } from "./proxyTS.js";
import withCORS from "./withCORS.js";

export default function getHandler(options, proxy) {
  return function (req, res) {
    req.corsAnywhereRequestState = { 
      maxRedirects: 5, 
      proxyBaseUrl: process.env.PUBLIC_URL 
    };

    if (req.method === "OPTIONS") {
      res.writeHead(200, withCORS({}, req));
      res.end();
      return;
    }

    const uri = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    
    // ROUTE 1: M3U8 Master/Media Playlist
    if (uri.pathname === "/m3u8-proxy") {
      const target = uri.searchParams.get("url");
      const headers = JSON.parse(uri.searchParams.get("headers") || "{}");
      return proxyM3U8(target, headers, res);
    } 
    
    // ROUTE 2: TS Segments & AES Keys
    if (uri.pathname === "/ts-proxy") {
      const target = uri.searchParams.get("url");
      const headers = JSON.parse(uri.searchParams.get("headers") || "{}");
      return proxyTs(target, headers, req, res);
    }

    // ROUTE 3: Standard CORS Proxy (For API/Images/etc)
    const targetPath = req.url.slice(1);
    const location = parseURL(targetPath);
    
    if (location && isValidHostName(location.hostname)) {
      req.url = location.path;
      proxy.web(req, res, { 
        target: location, 
        changeOrigin: true,
        headers: { host: location.host }
      });
      return;
    }

    res.writeHead(404, withCORS({}, req));
    res.end("Usage: /m3u8-proxy?url=... OR /https://site.com");
  };
}
