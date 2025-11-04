import { detectDevice, detectRegion } from "../services/detectors.js";
import {
  createNewLink,
  findLinkByCode,
  logClick,
  getAnalytics,
} from "../services/link.service.js";

export const createLink = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
      return res.status(400).json({
        error: "A valid originalUrl is required (must start with http/https)",
      });
    }

    const link = await createNewLink(originalUrl);
    return res.status(201).json(link);
  } catch (err) {
    console.error("Error creating link:", err);
    return res.status(500).json({ error: "Failed to create link" });
  }
};

export const redirectLink = async (req, res) => {
  try {
    const { code } = req.params;
    const found = await findLinkByCode(code);
    if (!found) return res.status(404).json({ error: "Link not found" });
    logClick({
      linkId: found.linkId,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      region: detectRegion(req.ip),
      device: detectDevice(req.headers["user-agent"]),
    });

    return res.redirect(found.originalUrl);
  } catch (err) {
    console.error("Error redirecting link:", err);
    return res.status(500).json({ error: "Redirect failed" });
  }
};

export const linkAnalytics = async (req, res) => {
  try {
    const { code } = req.params;
    const analytics = await getAnalytics(code);

    if (!analytics)
      return res
        .status(404)
        .json({ error: "No analytics found for this link" });

    return res.json(analytics);
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
