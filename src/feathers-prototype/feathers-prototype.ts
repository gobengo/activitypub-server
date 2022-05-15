import { Application, feathers } from "@feathersjs/feathers";
import "@feathersjs/transport-commons";
import { koa, errorHandler, rest, Middleware } from "@feathersjs/koa";
import { fileURLToPath } from "url";
import process from "process";
import { NodeRequestListenerServer } from "../server-http.js";
import { ServerCli } from "../server-cli.js";
import type { Server } from "../server-types";

type FeathersPrototypeApplication = Application<{
  messages: MessageService;
}>;

/**
 * little prototype app to play with feathersjs + activitypub-ish data
 */
export function FeathersPrototypeApp(): FeathersPrototypeApplication {
  const app = feathers();
  // Register the message service on the Feathers application
  app.use("messages", new MessageService());

  // Log every time a new message has been created
  app.service("messages").on("created", (message: Message) => {
    console.log("A new message has been created", message);
  });
  return app;
}

// This is the interface for the message data
interface Message {
  id?: number;
  text: string;
}

// A messages service that allows to create new
// and return all existing messages
class MessageService {
  messages: Message[] = [];

  async find() {
    // Just return all our messages
    return this.messages;
  }

  async create(data: Pick<Message, "text">) {
    // The new message is the data text with a unique identifier added
    // using the messages length since it changes whenever we add one
    const message: Message = {
      id: this.messages.length,
      text: data.text,
    };

    // Add new message to the list
    this.messages.push(message);

    return message;
  }
}

export const FeathersPrototypeServer = (): Server => {
  const fpApp = FeathersPrototypeApp();
  const httpApp = koa(feathers());
  function authentication(): Middleware {
    const mw: Middleware = async () => {
      console.log("in authentication middleware");
    };
    return mw;
  }
  httpApp.use(errorHandler());
  httpApp.use(authentication());
  httpApp.use(rest());
  const httpServer = NodeRequestListenerServer(httpApp.callback());
  return httpServer;
};

// A function that creates new messages and then logs
// all existing messages
const main = async (..._argv: string[]) => {
  const fpApp = FeathersPrototypeApp();
  // Create a new message on our message service
  await fpApp.service("messages").create({
    text: "Hello Feathers",
  });

  await fpApp.service("messages").create({
    text: "Hello again",
  });

  // Find all existing messages
  const messages = await fpApp.service("messages").find();

  console.log("All messages", messages);

  const server = FeathersPrototypeServer();
  const cli = ServerCli(server);
  await cli(..._argv);
};

if (import.meta.url && process.argv[1] === fileURLToPath(import.meta.url)) {
  main(...process.argv).catch((error) => {
    throw error;
  });
}
