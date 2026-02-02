import url from "node:url";

export default function parseURL(req_url) {
  const match = req_url.match(/^(?:(https?:)?\/\/)?(([^\/?]+?)(?::(\d{0,5})(?=[\/?]|$))?)([\/?][\S\s]*|$)/i);
  if (!match) return null;
  if (!match[1]) {
    req_url = (match[4] === "443" ? "https:" : "http:") + (req_url.startsWith("//") ? "" : "//") + req_url;
  }
  return url.parse(req_url);
}
