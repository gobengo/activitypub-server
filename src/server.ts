import EventEmitter from "events";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { LogFunction } from "./log.js";
import { ServerCli, StartServerResponse, ServerOptions } from "./server-cli.js";

/** start a server */
function start({ log }: ServerOptions): StartServerResponse {
  async function stop() {}
  log("info", "started server");
  return { stop };
}

export async function main() {
  const cli = ServerCli({ start });
  cli(...process.argv);
}
