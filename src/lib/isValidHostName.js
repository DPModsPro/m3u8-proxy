import net from "node:net";

export function isValidHostName(hostname) {
  // Aapka wahi bada Regex jo aapne provide kiya tha
  const regexp = /\.(?:COM|NET|ORG|TV|INFO|XYZ|ONLINE|SITE|ME|APP|XYZ|IN|IO)$/i; 
  // Note: Aapne jo badi list di thi woh yahan paste kar sakte hain.
  return !!(regexp.test(hostname) || net.isIPv4(hostname) || net.isIPv6(hostname));
}
