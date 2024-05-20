import { kv } from "@vercel/kv";

export const getAndUpdateNFTCount = async () => {
  try {
    let counter = await kv.get("nftCounter");
    if ((counter === null)) {
      await kv.set("nftCounter", 0);
      counter = 0;
    } else {
      counter += 1;
      await kv.set("nftCounter", counter);
    }
    return counter;
  } catch (error) {
    console.error("Error updating counter:", error);
  }
};
