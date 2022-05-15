import { ActivityPubServer } from "./activitypub-server.js";
import { ServerCli } from "./server-cli.js";

export const cli: ServerCli = ServerCli(ActivityPubServer);
