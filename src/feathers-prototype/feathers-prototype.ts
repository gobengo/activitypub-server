import { Application, feathers } from "@feathersjs/feathers";
const app = feathers();

export type Message = {
  id: string;
  text: string;
};

// A messages service that allows to create new
// and return all existing messages
class MessageService {
  protected messages: Message[];
  constructor() {
    this.messages = [];
  }

  async find() {
    // Just return all our messages
    return this.messages;
  }

  async create(data: Message) {
    // The new message is the data merged with a unique identifier
    // using the messages length since it changes whenever we add one
    const message = {
      id: this.messages.length.toString(),
      text: data.text,
    };

    // Add new message to the list
    this.messages.push(message);

    return message;
  }
}

export function FeathersPrototypeApp(): Application {
  const app = feathers();
  // Register the message service on the Feathers application
  app.use("messages", new MessageService());

  // Log every time a new message has been created
  app.service("messages").on("created", (message: any) => {
    console.log("A new message has been created", message);
  });
  return app;
}

// A function that creates new messages and then logs
// all existing messages
const main = async (..._argv: string[]) => {
  const app = FeathersPrototypeApp();
  // Create a new message on our message service
  await app.service("messages").create({
    text: "Hello Feathers",
  });

  await app.service("messages").create({
    text: "Hello again",
  });

  // Find all existing messages
  const messages = await app.service("messages").find();

  console.log("All messages", messages);
};

import { fileURLToPath } from "url";
import process from "process";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(...process.argv).catch((error) => {
    throw error;
  });
}
