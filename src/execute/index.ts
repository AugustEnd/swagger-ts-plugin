import { startCreate, defaultValue } from "../server/index";
const path = require("path");

startCreate({
    ...defaultValue,
    outputPath: path.resolve(__dirname, "../../"),
    serverList: [
        "trialpartner-web",
        "sms-service"
    ],
});
