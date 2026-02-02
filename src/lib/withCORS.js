export default function withCORS(headers, request) {
  headers["access-control-allow-origin"] = "*";
  headers["access-control-allow-methods"] = "GET, POST, OPTIONS";
  headers["access-control-allow-headers"] = "*";
  headers["access-control-expose-headers"] = Object.keys(headers).join(",");
  return headers;
}
