/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";
/*
import * as admin from "firebase-admin";

 import * as cors from "cors";

const db = admin.firestore();
*/
export function webhookStripe(request: functions.Request, response: functions.Response<any>) {
  console.log("test");
  /* const corsHandler = cors({
    origin: true,
  });*/

  /* corsHandler(request, response, async () => {
    try {
      return response.status(200);
    } catch (err) {
      console.log(err);
    }
  }); */
}
