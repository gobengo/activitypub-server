import EventEmitter from "events";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ConsoleLogFunction, LogFunction } from "./log.js";
import { MaybePromise, Server } from "./server-types.js";

export type ServerCli = (...argv: string[]) => Promise<void>;

export function ServerCli({ start }: Server) {
  const log: LogFunction = ConsoleLogFunction();
  return async function (...argv: string[]) {
    const args = yargs(hideBin(argv)).argv;
    const port = args.port ? Number(args.port ?? 0) : undefined;
    const { stop } = await start({ log, port });
    onExit(process, stop);
  };
}

/**
 * Helper for stopping a process on common signals
 * @param process - watch this for exit signals
 * @param stop - call this top stop when an exit signal has been received
 */
function onExit(
  process: EventEmitter & { exit(code: number): void },
  stop: () => MaybePromise<void>
) {
  function handleExit(signal: string) {
    console.log(`Received ${signal}. Stopping.`);
    Promise.resolve(stop())
      .then(() => {
        // eslint-disable-next-line no-process-exit
        process.exit(0);
      })
      .catch((error) => {
        console.error("error stopping NameServer", error);
        throw error;
      });
  }
  process.on("SIGINT", handleExit);
  process.on("SIGQUIT", handleExit);
  process.on("SIGTERM", handleExit);
}
