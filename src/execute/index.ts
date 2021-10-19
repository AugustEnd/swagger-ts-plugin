// import { startCreate, defaultValue } from "../server/index";
import { startCreate } from "../create/index";
import defaultValue from "../create/defaultValue";
const path = require("path");

const execute = async () => {
  await startCreate({
    ...defaultValue,
    serverList: ["sms-service"],
    appUrl: "http://eureka.dev.com:1111/eureka/apps",
  });
};

execute();
