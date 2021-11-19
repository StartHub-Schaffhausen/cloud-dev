/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {callEidData, callEidLogin} from "./call/eid/eid.call";
import {webhookStripe} from "./request/stripe/stripe.webhook";
import {getStartups, getPrintStartups} from "./request/startups/startups.get"; // api für startups
import {authUserCreate} from "./auth/user.create";
import {monthlyStartupNewsletter, weeklyStartupNewsletter} from "./scheduler/monthly.startup.scheduler";

// FIRESTORE DATABASE LISTENER


// SCHEDULER FOR NEWSLETTER
export const startupNewsletterMonthlyScheduler = functions.region("europe-west6").pubsub.schedule("00 08 1 * *").timeZone("Europe/Zurich").onRun(monthlyStartupNewsletter); // 1st of month 8:00
export const startupNewsletterWeeklyScheduler = functions.region("europe-west6").pubsub.schedule("00 08 * * 1").timeZone("Europe/Zurich").onRun(weeklyStartupNewsletter); // monday 8:00

// FIREBASE AUTH USER CREATE MANAGEMENT & WELCOME MAILS
export const createUserProfile = functions.region("europe-west6").auth.user().onCreate(authUserCreate);

// HTTP REQUESTS (EXTERNAL API CALLS)
export const startups = functions.region("europe-west6").https.onRequest(getStartups);
export const printStartups = functions.region("europe-west6").https.onRequest(getPrintStartups);

// STRIPE WEBHOOK
export const updateInvoiceStripeWebHook = functions.region("europe-west6").https.onRequest(webhookStripe);

// ONCALL eID+ USER DATA
export const eidData = functions.region("europe-west6").https.onCall(callEidData);

// ONCALL eID+ LOGIN
export const eidLogin = functions.region("europe-west6").https.onCall(callEidLogin);

// HTTP PROXY FOR EID GATEWAY

import * as express from "express";
import * as cors from "cors";
import {createProxyMiddleware} from "http-proxy-middleware"; //  Filter, Options, RequestHandler

const app = express();
app.use(cors({origin: true}));
app.use("/deveid", createProxyMiddleware({target: "https://gateway.test.eid.sh.ch", changeOrigin: true}));
app.use("/prodeid", createProxyMiddleware({target: "https://eid.sh.ch", changeOrigin: true}));

// https://gateway.test.eid.sh.ch/.well-known/openid-configuration

export const proxy = functions.region("europe-west6").https.onRequest(app);
