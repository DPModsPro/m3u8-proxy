import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const web_server_url = process.env.PUBLIC_URL || "";

export default async function proxyM3U8(url, headers, res) {
  try {
    const response = await axios.get(url, { headers });
    const m3u8 = response.data;
    const isMaster = m3u8.includes("RESOLUTION=");
    const lines = m3u8.split("\n");
    const newLines = [];

    for (let line of lines) {
      if (line.startsWith("#")) {
        if (line.startsWith("#EXT-X-KEY:") || line.startsWith("#EXT-X-MEDIA:TYPE=AUDIO")) {
          const regex = /https?:\/\/[^\""\s]+/g;
          line = line.replace(regex, (match) => {
            const endpoint = line.includes("AUDIO") ? "/m3u8-proxy" : "/ts-proxy";
            return `${web_server_url}${endpoint}?url=${encodeURIComponent(match)}&headers=${encodeURIComponent(JSON.stringify(headers))}`;
          });
        }
        newLines.push(line);
      } else if (line.trim()) {
        const absUrl = new URL(line, url).href;
        const endpoint = isMaster ? "/m3u8-proxy" : "/ts-proxy";
        newLines.push(`${web_server_url}${endpoint}?url=${encodeURIComponent(absUrl)}&headers=${encodeURIComponent(JSON.stringify(headers))}`);
      }
    }

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(newLines.join("\n"));
  } catch (err) {
    res.writeHead(500);
    res.end("M3U8 Error: " + err.message);
  }
}
