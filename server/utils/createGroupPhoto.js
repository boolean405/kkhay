// utils/createGroupPhotoWithSharp.js
import sharp from "sharp";
import axios from "axios";

export default async function createGroupPhoto(imageUrls) {
  const size = 256;
  const half = size / 2;

  const buffers = await Promise.all(
    imageUrls.slice(0, 4).map(async (url) => {
      const res = await axios.get(url, { responseType: "arraybuffer" });
      return await sharp(res.data).resize(half, half).toBuffer();
    })
  );

  // Default blank background
  const composite = [];

  // Position images in a 2x2 grid
  if (buffers[0]) composite.push({ input: buffers[0], top: 0, left: 0 });
  if (buffers[1]) composite.push({ input: buffers[1], top: 0, left: half });
  if (buffers[2]) composite.push({ input: buffers[2], top: half, left: 0 });
  if (buffers[3]) composite.push({ input: buffers[3], top: half, left: half });

  const finalImageBuffer = await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(composite)
    .jpeg()
    .toBuffer();

  const base64Image = `data:image/jpeg;base64,${finalImageBuffer.toString(
    "base64"
  )}`;

  return base64Image;
}
