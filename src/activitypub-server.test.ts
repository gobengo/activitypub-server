import { describe, expect, test } from "@jest/globals";
import assert from "assert";
import { use } from "./server-tester.js";
import { Server } from "./activitypub-server.js";

test(
  "can test server",
  use(Server, async ({ fetch, url }) => {
    const resp = await fetch(url.toString());
    assert.equal(resp.status, 200);
    const respBody = await resp.text();
    assert.ok(respBody.includes("activitypub-server"));
  })
);
