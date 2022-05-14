import { LogFunction } from "./log.js";

export type MaybePromise<T> = T | Promise<T>;

export interface ServerOptions {
  log: LogFunction;
  port?: number;
}

export interface StartServerResponse {
  stop(): Promise<void>;
  url: URL;
}

export type StartServer = (options: ServerOptions) => StartServerResponse;

export type Server = {
  start: StartServer;
};
