import express from "express";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
// import { uploadFileToIpfs, createAndConnect } from "./web3Storage.js";
import { getAndUpdateNFTCount } from "./kVStore.js";
// import { createMetadata } from "./createMetadata.js";
import { sendTgPic } from "./telegramBot.js";
import ws from "ws";
import { kv } from "@vercel/kv";

// await kv.set("nftCounter", null);
// console.log(await kv.get("nftCounter"))
const app = express();
const port = process.env.APP_PORT;
const corsOrigin = process.env.CORS_ORIGIN;
const secretMessage = process.env.SECRET_MESSAGE;
const we3StorageEmail = process.env.WEB3_STORAGE_EMAIL;

app.use(
  cors({
    origin: corsOrigin,
  })
);

const getImageUrl = (filename) => {
  const baseUrl = "https://getguap.xyz";
  return `${baseUrl}/tmp/${filename}`;
};

app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ limit: "300kb", extended: true }));

// Connect to web3Storage
// createAndConnect();

app.post("/login", (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.APP_PASSWORD;

  if (password === correctPassword) {
    res.status(200).json({ message: secretMessage });
  } else {
    res.status(401).json({ message: "login failed" });
  }
});

console.log("reached after login");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public/images', express.static(path.join(__dirname, 'public/images')));
app.use('/tmp', express.static('/tmp'));

app.post("/guapanate", async (req, res) => {
  try {
    const { image, name, backgroundRarity } = req.body;
    const fileCount = await getAndUpdateNFTCount();

    if (!image) {
      console.error("Image data is undefined.");
      return res.status(400).json({ message: "No image data provided" });
    }

    // Format the image data to base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = Buffer.from(base64Data, "base64");

    const imageName = `${fileCount}.jpeg`;
    const tempDir = '/tmp';
    const tempFilePath = path.join(tempDir, imageName);

    await fs.writeFile(tempFilePath, dataBuffer);
    console.log(`Image saved to: ${tempFilePath}`);

    const imageUrl = getImageUrl(imageName);
    console.log(`Image URL: ${imageUrl}`);
    await sendTgPic(imageUrl, name);

    return res.status(200).json();
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
