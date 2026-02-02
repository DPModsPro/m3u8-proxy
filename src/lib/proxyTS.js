import https from "node:https";
import http from "node:http";

export async function proxyTs(url, headers, req, res) {
  try {
    const uri = new URL(url);
    const client = url.startsWith("https") ? https : http;
    
    const options = {
      hostname: uri.hostname,
      port: uri.port,
      path: uri.pathname + uri.search,
      method: "GET",
      headers: { 
        ...headers, 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..." 
      }
    };

    const proxyReq = client.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, {
        "Content-Type": "video/mp2t",
        "Access-Control-Allow-Origin": "*"
      });
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (e) => {
      res.writeHead(500);
      res.end(e.message);
    });
    proxyReq.end();
  } catch (e) {
    res.writeHead(400);
    res.end("Invalid TS URL");
  }
}
