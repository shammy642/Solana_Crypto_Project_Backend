export const createMetadata = (name, nftGenerationNumber, nftNumber, cid, backgroundRarityLevel) => {
  return {
    name: name,
    description: `Gen${nftGenerationNumber} Guapped image`,
    image: `ipfs://${cid}`,
    external_url: "https://getguap.xyz",
    attributes: [{ trait_type: 'Mint Number', value: nftNumber, background: `Rarety level ${backgroundRarityLevel}` }],
    category: "image",
    properties: {
        files: [
          {
            "uri": `https://${cid}.ipfs.w3s.link`,
            "type": "image/png"
          },
        ]
    }
  };
};
