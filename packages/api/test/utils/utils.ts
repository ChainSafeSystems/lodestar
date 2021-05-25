import fastify, {FastifyInstance} from "fastify";
import {fetch} from "cross-fetch";
import querystring from "querystring";
import {FetchFn, FetchOpts} from "../../src/client/utils";

export function getTestServer(): {baseUrl: string; server: FastifyInstance} {
  const port = 10101;
  const baseUrl = `http://127.0.0.1:${port}`;

  const server = fastify({
    ajv: {customOptions: {coerceTypes: "array"}},
    querystringParser: querystring.parse,
  });

  server.addHook("onError", (request, reply, error, done) => {
    // eslint-disable-next-line no-console
    console.log(error);
    done();
  });

  before("start server", async () => {
    await new Promise((resolve, reject) => {
      server.listen(port, function (err, address) {
        if (err) reject(err);
        else resolve(address);
      });
    });
  });

  after("stop server", async () => {
    await server.close();
  });

  return {baseUrl, server};
}

export function getFetchFn(baseUrl: string): FetchFn {
  return {
    async json<T>(opts: FetchOpts): Promise<T> {
      const url = baseUrl + (opts.query ? opts.url + "?" + querystring.encode(opts.query as any) : opts.url);
      const bodyArgs = opts.body
        ? {headers: {"Content-Type": "application/json"}, body: JSON.stringify(opts.body)}
        : {};

      const res = await fetch(url, {method: opts.method, ...bodyArgs});
      if (!res.ok) throw Error(res.statusText);
      return (await res.json()) as T;
    },

    async arrayBuffer(opts: FetchOpts): Promise<ArrayBuffer> {
      const url = baseUrl + (opts.query ? opts.url + "?" + querystring.encode(opts.query as any) : opts.url);
      const bodyArgs = opts.body
        ? {headers: {"Content-Type": "application/json"}, body: JSON.stringify(opts.body)}
        : {};

      const res = await fetch(url, {method: opts.method, ...bodyArgs});
      if (!res.ok) throw Error(res.statusText);
      return await res.arrayBuffer();
    },
  };
}
