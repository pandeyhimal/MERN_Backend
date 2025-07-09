const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/app.log");

const logEvent = (message) => {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMsg);
};

module.exports = logEvent;
