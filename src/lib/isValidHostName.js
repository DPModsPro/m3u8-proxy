import net from "node:net";

export function isValidHostName(hostname) {
  // Note: Yahan aap apni puri 1000+ TLD list paste kar sakte hain
  const regexp = /\.(?:AAA|AARP|ABARTH|ABB|ABBOTT|...|ZONE|ZW)$/i; 
  return !!(regexp.test(hostname) || net.isIPv4(hostname) || net.isIPv6(hostname));
}
