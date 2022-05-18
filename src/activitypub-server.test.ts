import { describe, expect, test } from "@jest/globals";
import assert from "assert";
import { use } from "./server-tester.js";
import { ActivityPubServer } from "./activitypub-server.js";
import { ActivityPubFetch, FetchingActor } from "./activitypub-test-suite";

test(
  "can test server",
  use(ActivityPubServer(), async ({ fetch, url }) => {
    const resp = await fetch(url.toString());
    assert.equal(resp.status, 200);
    const respBody = await resp.text();
    assert.ok(respBody.includes("activitypub-server"));
  })
);

test(
  "can access main actor via FetchingActor",
  use(ActivityPubServer(), async ({ fetch, url }) => {
    const actor = FetchingActor(fetch(url.toString()));
    // @todo: make this type-safe (actor.id will need a decoder)
    const id = await ActivityPubFetch({ fetch })(actor.id);
    assert.equal(id, url.toString());
    // @todo: make this type-safe (actor.inbox will need a decoder)
    const inbox = await ActivityPubFetch({ fetch })(actor.inbox);
    assert.equal(inbox.type, "OrderedCollection");
  })
);
