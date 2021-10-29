/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {callEidData, callEidLogin} from "./call/eid/eid.call";
import {webhookStripe} from "./request/stripe/stripe.webhook";

// FIRESTORE DATABASE LISTENER


// SCHEDULER FOR NEWSLETTER


// FIREBASE AUTH USER MANAGEMENT & WELCOME MAILS


// HTTP REQUESTS (EXTERNAL API CALLS)


// STRIPE WEBHOOK
export const updateInvoiceStripeWebHook = functions.region("europe-west6").https.onRequest(webhookStripe);


// ONCALL eID+ USER DATA
export const eidData = functions.region("europe-west6").https.onCall(callEidData);

// ONCALL eID+ LOGIN
export const eidLogin = functions.region("europe-west6").https.onCall(callEidLogin);
