import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { MongoClient } from 'mongodb';
import router from './router';

const {
  DB_HOST,
  DB_NAME,
  DB_PORT,
  SESSION_MAX_AGE,
  SESSION_SECRET,
  COOKIE_DOMAIN,
} = process.env as {
  DB_HOST: string;
  DB_NAME: string;
  DB_PORT: string;
  SESSION_MAX_AGE: string;
  SESSION_SECRET: string;
  COOKIE_DOMAIN: string;
};

/**
 * App module returns a promise so that express starts only if mongoDB connects.
 * For backward compatibility, done callback function will be fired when promise resolves.
 */
export default async function createExpressApp(done?: Function) {
  /**
   * Create a connection to express-seed database of MongoDB.
   * Express application waits until mongoDB connects.
   */
  const mongoInstance = await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

  /* eslint-disable-next-line no-console */
  console.log(`MongoDB connected at mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

  const app = express();

  /**
   * Setup user sessions.
   */
  app.use(session({
    cookie: {
      /**
       * Session expires after some time period (milliseconds).
       * maxAge cannot be a string, it must be a number.
       */
      maxAge: Number(SESSION_MAX_AGE),
      /**
       * Set domain as domain.com to share session between subdomain.domain.com.
       */
      domain: COOKIE_DOMAIN,
    },
    /**
     * Don't save to db if session is not modified.
     */
    resave: false,
    /**
     * Resetting the expiration countdown.
     */
    rolling: true,
    /**
     * Don't create sessions for unknown users.
     */
    saveUninitialized: false,
    secret: SESSION_SECRET,
    /**
     * Save user sessions in MongoDB.
     * Re-use MongoDB connection.
     */
    store: MongoStore.create({
      client: mongoInstance.connection.getClient() as unknown as MongoClient,
    }),
  }));

  /**
   * Parse application/json.
   */
  app.use(express.json());
  /**
   * Parse application/x-www-form-urlencoded.
   */
  app.use(express.urlencoded({ extended: true }));

  /**
   * RESTful API services.
   */
  app.use(router);

  /**
   * Return status code 500 for all errors that are not our known types.
   */
  app.use((_err: any, _req: any, res: { sendStatus: (arg0: number) => any; }, _next: any) => {
    return res.sendStatus(500);
  });

  /**
   * For circumstances where promise is not available,
   * done callback function will be fired when promise resolves.
   */
  if (typeof done === 'function') {
    done();
  }

  return app;
}
