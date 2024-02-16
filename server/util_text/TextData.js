const getTextData = (line) => {
  const xSum =
    line.boundingBox.x_lowerL +
    line.boundingBox.x_upperL +
    line.boundingBox.x_lowerR +
    line.boundingBox.x_upperR;
  const ySum =
    line.boundingBox.y_lowerL +
    line.boundingBox.y_upperL +
    line.boundingBox.y_lowerR +
    line.boundingBox.y_upperR;

  const center = [xSum / 4, ySum / 4];

  const area =
    0.5 *
    Math.abs(
      line.boundingBox.x_lowerL * line.boundingBox.y_upperL +
        line.boundingBox.x_upperL * line.boundingBox.y_lowerR +
        line.boundingBox.x_lowerR * line.boundingBox.y_upperR +
        line.boundingBox.x_upperR * line.boundingBox.y_lowerL -
        line.boundingBox.x_upperL * line.boundingBox.y_lowerL -
        line.boundingBox.x_lowerR * line.boundingBox.y_upperL -
        line.boundingBox.x_upperR * line.boundingBox.y_lowerR -
        line.boundingBox.x_lowerL * line.boundingBox.y_upperR
    );

  return { text: line.text, center: center, size: area };
};

module.exports = getTextData;
