const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
sharp.cache(false);

async function useSharp(inputPath, outputPath, quality) {
  await sharp(inputPath).jpeg({ quality }).toFile(outputPath);
}

async function compress(imagePath, imageName) {
  const maxBytes = 4 * 1024 * 1024;

  let inputPath = path.join(imagePath, "image" + imageName);
  let outputPath;

  let stats = fs.statSync(inputPath);
  let imageSizeInBytes = stats.size;

  while (imageSizeInBytes > maxBytes) {
    outputPath = path.join(imagePath, imageSizeInBytes + "_" + imageName);
    await useSharp(inputPath, outputPath, 95);
    fs.unlinkSync(inputPath);
    inputPath = outputPath;
    stats = fs.statSync(inputPath);
    imageSizeInBytes = stats.size;
  }

  return inputPath;
}

module.exports = compress;
