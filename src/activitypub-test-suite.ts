import * as assert from "assert";
import jsonpath from "jsonpath";

export type ActivityPubServerTestSuite = () => {
  test: (options: TestSuiteOptions) => Promise<void>;
};

type Fetch = typeof fetch;
export interface TestSuiteOptions {
  url: URL;
  fetch: Fetch;
}

export function FetchingActor(actorRequest: Promise<Response>) {
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
  const id = async (): Promise<[ToUrl, ToJsonPath]> => {
    const baseUrl = await actorUrl;
    return [
      {
        toURL() {
          return new URL(baseUrl);
        },
      },
      {
        toJsonPath() {
          return "$.id";
        },
      },
    ];
  };
  const inbox = async (): Promise<ToUrl> => {
    const actor = await actorJson;
    const baseUrl = await actorUrl;
    return {
      toURL(): URL {
        return new URL(actor.inbox, baseUrl);
      },
    };
  };
  return {
    get id() {
      return id();
    },
    get inbox() {
      return inbox();
    },
  };
}

type ToUrl = {
  toURL(): URL;
};

type ToJsonPath = {
  toJsonPath(): string;
};

/** todo: support generic 'parsed type' and support io-ts decoder */
type ActivityPubLocator =
  | ToUrl
  /** fetch a url, parse as json, then jsonpath */
  | [ToUrl, ToJsonPath];

export function ActivityPubFetch({ fetch }: { fetch: Fetch }) {
  async function apFetch(_locator: Promise<ActivityPubLocator>) {
    const locator = await _locator;
    const { toURL }: ToUrl = Array.isArray(locator) ? locator[0] : locator;
    const { toJsonPath }: ToJsonPath = Array.isArray(locator)
      ? locator[1]
      : { toJsonPath: () => "$" };
    const resp = await fetch(toURL().toString());
    const respBody = await resp.json();
    const jpath = toJsonPath();
    const result = jsonpath.query(respBody, jpath);
    if (!result.length) {
      throw new Error(
        `ActivityPubFetch failed to find result for jsonpath ${jpath}`
      );
    }
    return result[0];
  }
  return apFetch;
}
