/* eslint-disable max-len */
import * as functions from "firebase-functions";

import {callEidData} from "./call/eid/eid.call";

// FIRESTORE DATABASE LISTENER


// SCHEDULER FOR NEWSLETTER


// FIREBASE AUTH USER MANAGEMENT & WELCOME MAILS


// HTTP REQUESTS (EXTERNAL API CALLS)


// ONCALL eID+ USER DATA
export const eidData = functions.region("europe-west6").https.onCall(callEidData);

// ONCALL eID+ LOGIN
