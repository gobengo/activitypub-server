import { cli } from "./cli.js";
import { fileURLToPath } from "url";
import process from "process";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  cli(...process.argv).catch((error) => {
    throw error;
  });
}
