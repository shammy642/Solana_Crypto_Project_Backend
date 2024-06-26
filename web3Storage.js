import { create } from "@web3-storage/w3up-client";
import { filesFromPaths } from "files-from-path";


const client = await create();

export const createAndConnect = async () => {
 try {
    await client.login("guapteamsol@gmail.com");
    await client.setCurrentSpace(
      process.env.WEB3_STORAGE_DID
    )
 }
 catch (error) {
    console.log("error logging in")
 }
};

export const uploadFileToIpfs = async (filePath) => {
    console.log(filePath)
    try {
      // const files = await filesFromPaths(filePath);
      const cid = await client.uploadFile(filePath);
      console.log(`https://${cid}.ipfs.w3s.link`);
      return cid; 
    } catch (error) {
      console.error("Upload failed:", error);
      return null;  
    }
  };
  