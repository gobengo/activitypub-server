import { describe, expect, test } from "@jest/globals";
import assert from "assert";
import { use } from "../server-tester.js";
import { FeathersPrototypeServer } from "./feathers-prototype";

test(
  "can test server",
  use(FeathersPrototypeServer(), async ({ fetch, url }) => {
    const resp = await fetch(url.toString());
    assert.equal(resp.status, 404);
    const respBody = await resp.text();
    // assert.ok(respBody.includes("activitypub-server"));
  })
);
