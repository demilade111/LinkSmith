import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export const detectRegion = (ip) => {
  try {
    const geo = geoip.lookup(ip);
    return geo ? geo.country : "Unknown";
  } catch {
    return "Unknown";
  }
};

export const detectDevice = (userAgent) => {
  try {
    const parser = new UAParser(userAgent);
    return parser.getDevice().type || "desktop";
  } catch {
    return "unknown";
  }
};
