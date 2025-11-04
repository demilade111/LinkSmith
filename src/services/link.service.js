import { PrismaClient } from "@prisma/client";
import redis from "../config/redis.js";
import { generateShortCode } from "../utils/shortener.js";

const prisma = new PrismaClient();

export const createNewLink = async (originalUrl) => {
  const shortCode = generateShortCode();
  const newLink = await prisma.link.create({
    data: { originalUrl, shortCode },
  });
  // Cache both linkId and originalUrl as JSON
  await redis.setEx(
    shortCode,
    300,
    JSON.stringify({
      linkId: newLink.id,
      originalUrl: newLink.originalUrl,
    })
  );
  return newLink;
};
export const findLinkByCode = async (shortCode) => {
  const cachedData = await redis.get(shortCode);
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    return { ...parsed, fromCache: true };
  }
  const link = await prisma.link.findUnique({ where: { shortCode } });
  if (!link) return null;

  await redis.setEx(
    shortCode,
    300,
    JSON.stringify({
      linkId: link.id,
      originalUrl: link.originalUrl,
    })
  );

  return { linkId: link.id, originalUrl: link.originalUrl, fromCache: false };
};

export const logClick = async ({ linkId, ip, userAgent, region, device }) => {
  try {
    await prisma.click.create({
      data: { linkId, ip, userAgent, region, device },
    });
  } catch (err) {
    console.error("Error logging click:", err.message);
  }
};

export const getAnalytics = async (shortCode) => {
  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: { clicks: true },
  });

  if (!link) return null;

  const summary = link.clicks.reduce(
    (acc, click) => {
      acc.total += 1;
      acc.byRegion[click.region] = (acc.byRegion[click.region] || 0) + 1;
      acc.byDevice[click.device] = (acc.byDevice[click.device] || 0) + 1;
      return acc;
    },
    { total: 0, byRegion: {}, byDevice: {} }
  );

  return summary;
};
