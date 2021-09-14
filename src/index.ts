import "regenerator-runtime/runtime";
import './config';
import { AddressInfo } from "net";
import createExpressApp from './app';

const { SERVER_PORT } = process.env;

/**
 * Start server.
 * App module exports a promise. That promise is resolved only if mongoDB connects.
 */
createExpressApp().then((app) => {
  const server = app.listen(SERVER_PORT, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Express Seed is now listening at port ${(server.address() as AddressInfo).port}.`);
  });
});
