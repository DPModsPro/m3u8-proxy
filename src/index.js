import dotenv from "dotenv";
import createServer from "./lib/createServer.js";
import colors from "colors";

dotenv.config();

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 8080;
const web_server_url = process.env.PUBLIC_URL || `http://localhost:${port}`;

export default function server() {
  createServer({
    originBlacklist: [],
    originWhitelist: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["*"],
    requireHeader: [],
    removeHeaders: [
      "cookie", "cookie2", "x-request-start", "x-request-id", "via", "connect-time", "total-route-time"
    ],
    redirectSameOrigin: true,
    httpProxyOptions: { xfwd: false },
  }).listen(port, host, function () {
    console.log(
      colors.green("✅ Proxy Server running on ") + colors.blue(`${web_server_url}`)
    );
  });
}

server();
