export default function withCORS(headers, request) {
  headers["access-control-allow-origin"] = "*";
  headers["access-control-allow-methods"] = "GET, POST, OPTIONS, HEAD";
  headers["access-control-allow-headers"] = request.headers["access-control-request-headers"] || "*";
  headers["access-control-expose-headers"] = Object.keys(headers).join(",");
  headers["access-control-max-age"] = "600";
  return headers;
}
