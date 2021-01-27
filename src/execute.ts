import { startCreate, defaultValue } from "./server";
const path = require("path");

startCreate({
    ...defaultValue,
    outputPath: path.resolve(__dirname, "../"),
    serverList: ["trialpartner-web", "sms-service"],
});
