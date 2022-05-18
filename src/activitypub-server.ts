import { Server as IServer } from "./server-types.js";
import { RequestListener } from "http";
import { NodeRequestListenerServer } from "./server-http.js";
import { Parser, Response, Route, URL, route, router } from "typera-koa";
import * as t from "io-ts";
import { default as Koa } from "koa";
import bodyParser from "koa-bodyparser";

const Listener: () => RequestListener = () => (req, res) => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(router(actor, inbox).handler());
  const listener = app.callback();
  listener(req, res);
};

// interface User {
//   id: number;
//   name: string;
//   age: number;
// }

// // Decodes an object { name: string, age: number }
// const userBody = t.type({ name: t.string, age: t.number });

type Actor = {
  name: string;
  inbox: string;
};

const actor: Route<Response.Ok<Actor>> = route
  .get("/") // Capture id from the path
  .handler(async (request) => {
    return Response.ok({
      id: request.ctx.URL.toString(),
      name: "activitypub-server",
      inbox: "/inbox",
    });
  });

type Inbox = {
  type: "OrderedCollection";
};
const inbox: Route<Response.Ok<Inbox>> = route
  .get("/inbox") // Capture id from the path
  .handler(async () => {
    return Response.ok({
      type: "OrderedCollection",
    });
  });

export const ActivityPubServer = (): IServer => {
  return NodeRequestListenerServer(Listener());
};
