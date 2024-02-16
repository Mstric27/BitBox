require("dotenv").config();
const sleep = require("util").promisify(setTimeout);

const recognitionKey = process.env.OCR_VISION_RECOGNITION_KEY;
const recognitionEndpoint = process.env.OCR_VISION_RECOGNITION_ENDPOINT;

const fs = require("fs");
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;
const ComputerVisionClient =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({
    inHeader: { "Ocp-Apim-Subscription-Key": recognitionKey },
  }),
  recognitionEndpoint
);

async function ocrVision(image) {
  const recognizedTextList = [];

  const STATUS_SUCCEEDED = "succeeded";
  const STATUS_FAILED = "failed";

  const streamResponse = await computerVisionClient
    .readInStream(() => fs.createReadStream(image))
    .then((response) => response);

  const operationLocationLocal = streamResponse.operationLocation;
  const operationIdLocal = operationLocationLocal.substring(
    operationLocationLocal.lastIndexOf("/") + 1
  );

  while (true) {
    const readOpResult = await computerVisionClient
      .getReadResult(operationIdLocal)
      .then((result) => result);

    if (readOpResult.status === STATUS_FAILED) {
      console.log("The Read File operation has failed.");
      break;
    }
    if (readOpResult.status === STATUS_SUCCEEDED) {
      for (const textRecResult of readOpResult.analyzeResult.readResults) {
        for (const line of textRecResult.lines) {
          let text = line.text;
          const splitText = text.split(" ");
          text = splitText.join("%20");
          recognizedTextList.push({
            text: text,
            boundingBox: {
              x_lowerL: line.boundingBox[0],
              y_lowerL: line.boundingBox[1],
              x_upperL: line.boundingBox[2],
              y_upperL: line.boundingBox[3],
              x_lowerR: line.boundingBox[4],
              y_lowerR: line.boundingBox[5],
              x_upperR: line.boundingBox[6],
              y_upperR: line.boundingBox[7],
            },
          });
        }
      }
      break;
    }
    await sleep(1000);
  }

  return recognizedTextList;
}

module.exports = ocrVision;
