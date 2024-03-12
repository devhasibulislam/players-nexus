// pages/api/image.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid image URL" });
  }

  try {
    const imageRes = await fetch(url);
    if (!imageRes.ok) throw new Error("Failed to fetch the image.");

    const imageBuffer = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type");

    res.setHeader("Content-Type", contentType || "application/octet-stream");
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error("Failed to fetch image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
}
