import * as assert from "assert";

export type ActivityPubServerTestSuite = () => {
  test: (options: TestSuiteOptions) => Promise<void>;
};

type Fetch = typeof fetch;
export interface TestSuiteOptions {
  url: URL;
  fetch: Fetch;
}

export const ActivityPubServerTestSuite: ActivityPubServerTestSuite = () => {
  const test = async (options: TestSuiteOptions) => {
    const { url, fetch } = options;
    const actor = Actor(fetch(url.toString()));
    const inbox = await ActivityPubFetch(options)(actor.inbox);
    assert.equal(inbox.type, "OrderedCollection");
  };
  return { test };
};

function Actor(actorRequest: Promise<Response>) {
  const actorUrl = actorRequest.then(({ url }) => url);
  const actorText = actorRequest.then((r) => r.text());
  const actorJson = actorText.then(async (text) => {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      console.debug("error parsing actor as json", { text });
      throw error;
    }
    return parsed;
  });
  return {
    get inbox(): Promise<ToUrl> {
      return (async () => {
        const actor = await actorJson;
        const baseUrl = await actorUrl;
        return {
          toURL(): URL {
            return new URL(actor.inbox, baseUrl);
          },
        };
      })();
    },
  };
}

type ToUrl = {
  toURL(): URL;
};

function ActivityPubFetch({ fetch }: { fetch: Fetch }) {
  async function apFetch(_locator: Promise<ToUrl>) {
    const locator = await _locator;
    const resp = await fetch(locator.toURL().toString());
    const respBody = await resp.json();
    return respBody;
  }
  return apFetch;
}
