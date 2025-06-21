import sharp from "sharp";
import axios from "axios";

const canvasSize = 256;

async function createCircularImage(buffer, diameter) {
  const circleSvg = `<svg width="${diameter}" height="${diameter}">
    <circle cx="${diameter / 2}" cy="${diameter / 2}" r="${
    diameter / 2
  }" fill="#fff"/>
  </svg>`;

  return await sharp(buffer)
    .resize(diameter, diameter)
    .composite([{ input: Buffer.from(circleSvg), blend: "dest-in" }])
    .png()
    .toBuffer();
}

export default async function generateGroupPhoto(imageUrls) {
  const count = Math.min(imageUrls.length, 4);

  // Responsive avatar size
  let avatarSize = 256; // default for 1
  if (count === 2) avatarSize = 140;
  if (count === 3) avatarSize = 120;
  if (count === 4) avatarSize = 100;

  const overlapRatio = 0.4; // how much they overlap (40%)
  const overlapOffset = avatarSize * (1 - overlapRatio);
  const totalWidth = overlapOffset * (count - 1) + avatarSize;
  const startX = (canvasSize - totalWidth) / 2;
  const centerY = (canvasSize - avatarSize) / 2;

  const buffers = await Promise.all(
    imageUrls.slice(0, count).map(async (url) => {
      const res = await axios.get(url, { responseType: "arraybuffer" });
      return await createCircularImage(res.data, avatarSize);
    })
  );

  const composite = [];

  for (let i = 0; i < count; i++) {
    composite.push({
      input: buffers[i],
      left: Math.round(startX + i * overlapOffset),
      top: centerY,
    });
  }

  const finalImageBuffer = await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite(composite)
    .png()
    .toBuffer();

  const base64Image = `data:image/jpeg;base64,${finalImageBuffer.toString(
    "base64"
  )}`;

  return base64Image;
}
