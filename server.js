import express from "express";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadFileToIpfs, createAndConnect } from "./web3Storage.js";
import { getAndUpdateNFTCount } from "./kVStore.js";
import { createMetadata } from "./createMetadata.js";
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

app.use("/images", express.static("/Guapanated_Images"));

app.use(
  cors({
    origin: corsOrigin,
  })
);
app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ limit: "300kb", extended: true }));

//Connect to web3Storage
createAndConnect();

app.post("/login", (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.APP_PASSWORD;

  if (password === correctPassword) {
    res.status(200).json({ message: secretMessage });
  } else {
    res.status(401).json({ message: "login failed" });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.post("/guapanate", async (req, res) => {
//   try {
//     const { image, name, backgroundRarity } = req.body;
//     const fileCount = await getAndUpdateNFTCount();

//     if (!image) {
//       console.error("Image data is undefined.");
//       return res.status(400).json({ message: "No image data provided" });
//     }

//     // Format the image data to base64
//     const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
//     const dataBuffer = Buffer.from(base64Data, "base64");

//     // Convert base64 to a binary string
//     const binaryString = atob(base64Data);

//     // Create an array buffer from the binary string
//     const len = binaryString.length;
//     const bytes = new Uint8Array(len);
//     for (let i = 0; i < len; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }

//     // Create a Blob from the array buffer
//     const blob = new Blob([bytes], { type: "image/jpeg" });

//     const imageName = `${fileCount}.jpeg`;
//     const metadataName = `${fileCount}.json`;
//     const imagePath = path.join(__dirname, "nfts", imageName);
//     const metadataPath = path.join(__dirname, "nfts", metadataName);
//     let imageURI;
//     fs.writeFile(imagePath, dataBuffer, async (err) => {
//       if (err) {
//         console.error("Failed to save the file:", err);
//         return res.status(500).json({ message: "Failed to save the file" });
//       } else {
//         try {
//           imageURI = await uploadFileToIpfs(blob);
          

//           const metadata = createMetadata(
//             name,
//             1,
//             fileCount,
//             imageURI,
//             backgroundRarity
//           );
//           const metadataJSON = JSON.stringify(metadata);

//           fs.writeFile(metadataPath, metadataJSON, "utf8", async (err) => {
//             if (err) {
//               console.error("Error writing metadata file:", err);
//               return res
//                 .status(500)
//                 .json({ message: "Error writing metadata file" });
//             } else {
//               const metadataBlob = new Blob([metadataJSON], {
//                 type: "application/json",
//               });

//               console.log("reached metadata Upload stage");
//               const metadataURI = await uploadFileToIpfs(metadataBlob);
//               sendTgPic(`https://${imageURI}.ipfs.w3s.link`, name, metadataURI);
//               return res.status(200).json({ uri: metadataURI });
//             }
//           });
//         } catch (uploadError) {
//           console.error("Error uploading file to IPFS:", uploadError);
//           return res
//             .status(500)
//             .json({ message: "Error uploading file to IPFS" });
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });


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

    // Convert base64 to a binary string
    const binaryString = atob(base64Data);

    // Create an array buffer from the binary string
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the array buffer
    const blob = new Blob([bytes], { type: "image/jpeg" });

    const imageName = `${fileCount}.jpeg`;
    const metadataName = `${fileCount}.json`;
    const imagePath = path.join(__dirname, "nfts", imageName);
    const metadataPath = path.join(__dirname, "nfts", metadataName);
    const imageURI = await uploadFileToIpfs(blob);
    const metadata = createMetadata(
      name,
      1,
      fileCount,
      imageURI,
      backgroundRarity
    );
    const metadataJSON = JSON.stringify(metadata);
    const metadataBlob = new Blob([metadataJSON], {
      type: "application/json",
    });

    console.log("reached metadata Upload stage");
    const metadataURI = await uploadFileToIpfs(metadataBlob);
    sendTgPic(`https://${imageURI}.ipfs.w3s.link`, name, metadataURI);
    return res.status(200).json({ uri: metadataURI });

  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});