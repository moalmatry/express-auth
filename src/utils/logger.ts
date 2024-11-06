import logger from "pino";
import days from "dayjs";
import config from "config";
import dayjs from "dayjs";

const level = config.get<string>("logLevel");

const log = logger({
  transport: {
    target: "pino-pretty",
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `"time":${dayjs().format()}`,
});

export default log;
