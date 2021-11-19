/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable require-jsdoc */
// import * as functions from "firebase-functions";
import * as cors from "cors";

import * as express from "express";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


export function app;


