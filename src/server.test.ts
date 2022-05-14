import { describe, expect, test } from "@jest/globals";
import assert from "assert";
import { use } from "./server-tester.js";
import { Server } from "./server.js";

const theTest: () => Promise<void> = use(Server, async ({ fetch, url }) => {
  const resp = await fetch(url.toString());
  assert.equal(resp.status, 200);
});

test("can test server", theTest);
