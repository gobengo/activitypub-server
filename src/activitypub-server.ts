import {
  Server as IServer,
} from "./server-types.js";
import { RequestListener } from "http";
import { NodeRequestListenerServer } from "./server-http.js";

const listener: RequestListener = (_req, res) => {
  res.writeHead(200);
  res.end("activitypub-server");
};

export const ActivityPubServer = (): IServer => {
  return NodeRequestListenerServer(listener);
};
