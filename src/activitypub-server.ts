import {
  Server as IServer,
  ServerOptions,
  StartServerResponse,
} from "./server-types.js";
import { ServerCli } from "./server-cli.js";
import { RequestListener } from "http";
import * as nodeHttp from "http";
import { addressUrl, listen } from "./http.js";

/** start a server */
async function start({
  log,
  port,
}: ServerOptions): Promise<StartServerResponse> {
  const listener: RequestListener = (_req, res) => {
    res.writeHead(200);
    res.end("activitypub-server");
  };
  const httpServer = nodeHttp.createServer(listener);
  async function stop() {
    await new Promise((resolve, reject) => {
      log("debug", "closing server");
      httpServer.close((error) => (error ? reject(error) : resolve(true)));
    });
  }
  await listen(httpServer, port ?? 0);
  const url = addressUrl(httpServer.address());
  log("info", "started server", url.toString());
  return { stop, url };
}

export const Server: IServer = { start };
export const ActivityPubServer = Server;
