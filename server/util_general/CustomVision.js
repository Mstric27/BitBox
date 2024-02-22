require("dotenv").config();

const predictionKey = process.env.CUSTOM_VISION_PREDICTION_KEY;
const predictionEndpoint = process.env.CUSTOM_VISION_PREDICTION_ENDPOINT;
const modelName = process.env.CUSTOM_VISION_MODEL_NAME;
const projectId = process.env.CUSTOM_VISION_PROJECT_ID;

const sizeOf = require("image-size");
const fs = require("fs");
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;
const PredictionAPIClient =
  require("@azure/cognitiveservices-customvision-prediction").PredictionAPIClient;

const predictorClient = new PredictionAPIClient(
  new ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } }),
  predictionEndpoint
);

async function customVision(image) {
  const imageData = fs.readFileSync(image);
  const imageDimensions = sizeOf(imageData);
  let imageHeight = imageDimensions.width;
  let imageWidth = imageDimensions.height;

  const customVisonResults = await predictorClient.detectImage(
    projectId,
    modelName,
    imageData
  );

  const boardgames = [];

  let boundingBoxResults;
  let coordinates;

  customVisonResults.predictions.forEach((predictedResult) => {
    if (predictedResult.probability * 100 >= 98) {
      boundingBoxResults = [
        Math.ceil(predictedResult.boundingBox.left * imageWidth),
        Math.ceil(predictedResult.boundingBox.top * imageHeight),
        Math.ceil(predictedResult.boundingBox.width * imageWidth),
        Math.ceil(predictedResult.boundingBox.height * imageHeight),
      ];

      coordinates = {
        leftBorder: boundingBoxResults[0],
        topBorder: boundingBoxResults[1],
        rightBorder: boundingBoxResults[0] + boundingBoxResults[2],
        bottomBorder: boundingBoxResults[1] + boundingBoxResults[3],
      };
      boardgames.push(coordinates);
    }
  });

  return boardgames;
}

module.exports = customVision;
