import {
  Server as IServer,
  ServerOptions,
  StartServerResponse,
} from "./server-types.js";
import { ServerCli } from "./server-cli.js";

/** start a server */
function start({ log }: ServerOptions): StartServerResponse {
  async function stop() {}
  const url = new URL('http://activitypub.rocks')
  log("info", "started server");
  return { stop, url };
}

export const Server: IServer = { start };

export async function main() {
  const cli = ServerCli({ start });
  cli(...process.argv);
}
