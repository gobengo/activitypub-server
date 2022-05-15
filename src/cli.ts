import { ActivityPubServer } from "./activitypub-server.js";
import { ServerCli } from "./server-cli.js";

/**
 * activitypub-server cli.
 * this is run by `npm start` from project root.
 * It's usually passed ...process.argv, but args could come from elsewhere.
 */
export const cli: ServerCli = ServerCli(ActivityPubServer());
