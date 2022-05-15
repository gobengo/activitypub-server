import { describe, expect, test } from "@jest/globals";
import assert from "assert";
import { use } from "../server-tester.js";
import {
  FeathersPrototype,
  FeathersPrototypeServer,
} from "./feathers-prototype";
import { feathers } from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import { addressUrl } from "../http.js";

test("can test server using feathers client", async () => {
  await use(await FeathersPrototypeServer(), async ({ fetch, url }) => {
    const clientApp = feathers();
    const restClient = rest(url.toString().replace(/\/$/, ""));
    clientApp.configure(restClient.fetch(fetch.bind(globalThis)));
    const rootService = clientApp.service("/");
    const index = await rootService.find();
    assert.ok(index.name.includes("feathers-prototype"));
  })();
});
