
import sharp from "sharp";

import * as fs from "fs/promises";
import { transparentBackground } from "transparent-background";

export const removeBackground = async (image) => {
    console.log("removing background.....")
    try {
    const imageBuffer = decodeBase64Image(image)
    const input = await sharp(imageBuffer);
    const processedBuffer = await transparentBackground(input, "png", {
		// uses a 1024x1024 model by default
		// enabling fast uses a 384x384 model instead
		fast: false,
	});
    const base64Image = processedBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log("background removed!");
    return dataUrl;
	
    console.log("background removed!")
        
    } catch (error) {
        console.log("error removing background: ", error)
    }
    
}

const decodeBase64Image = (dataUrl) => {
    const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid input string');
    }
    return Buffer.from(matches[2], 'base64');
  };