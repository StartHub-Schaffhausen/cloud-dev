/* eslint-disable max-len */
/* eslint-disable camelcase */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {CallableContext} from "firebase-functions/lib/providers/https";

// import {configurationSH} from '../../config/oidc/schaffhausen';
import {configurationSHtest} from "../../config/oidc/schaffhausen.test";

// const config = configurationSH;
const config = configurationSHtest;


// var axios = require('axios');
import * as axios from "axios";
import * as FormData from "form-data";
// import { addMinutes } from 'date-fns';

// import jwt_decode from 'jwt-decode';
// var jwt = require('jsonwebtoken');
// import {auth} from 'firebase-admin';

const db = admin.firestore();

interface EidLogin {
  id_token: string;
  access_token: string;
}

interface EidDataTokenRequest {
  authorization_code: string;
  state: string;
  redirect_uri: string;
}

export async function callEidLogin(data: EidDataTokenRequest, context: CallableContext): Promise<string | undefined> {
  // GET TOKEN FROM EID
  const eidToken: EidLogin | undefined = await postEidToken(data);
  if (!eidToken) {
    return undefined;
  }

  const userData: any = await getEidUserData(eidToken.access_token);
  const customtoken = await admin.auth().createCustomToken(userData.sub, {

  });

  // create entry in db for user.
  await db
      .collection("userProfile")
      .doc(userData.sub)
      .set(
          {
            firstName: userData.given_name,
            lastName: userData.family_name,
            email: userData.email,
          },
          {
            merge: true,
          }
      );

  // TODO: Validate token with public key from eid gateway.

  console.log(JSON.stringify(customtoken));
  return customtoken;
  // return eidToken.id_token;
  /*
  console.log(JSON.stringify(admin.credential.applicationDefault()));
  console.log(JSON.stringify(admin.credential.cert(functions.config().firebase)));

  var customtoken = jwt.sign(
    {
      iss: functions.config().client_email,
      sub: functions.config().client_email,
      aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
      iat: decoded.iat,
      exp: decoded.exp,
      uid: decoded.sub,
      claims: {
        admin: true,
        configuration: data.configuration,
      },
    },
    admin.credential.applicationDefault(),
    {algorithm: 'RS256'}
  );*/
}

export async function callEidData(data: EidDataTokenRequest, context: CallableContext): Promise<EidUserData | undefined> {
  const eidToken: EidLogin | undefined = await postEidToken(data);

  if (!eidToken) {
    return undefined;
  }

  // console.log('3. GET UserData with Access Token: ' + eidToken.access_token);
  return await getEidUserData(eidToken.access_token);
}

async function postEidToken(data: EidDataTokenRequest): Promise<EidLogin | undefined> {
  const form = new FormData();
  form.append("code", data.authorization_code);
  form.append("grant_type", "authorization_code");
  form.append("redirect_uri", data.redirect_uri );
  form.append("state", data.state );

  const axiosConfig: any = {
    method: "post",
    url: config.token_endpoint,
    headers: {
      Authorization:
        "Basic " + Buffer.from(functions.config().oidc.user + ":" + functions.config().oidc.pwd).toString("base64"),
      ...form.getHeaders(),
    },
    data: form,
  };

  try {
    const response: any = await axios.default(axiosConfig);
    return response.data;
  } catch (e) {
    console.log("Token error");
    console.error(e);
    return undefined;
  }
}

async function getEidUserData(accessToken: string): Promise<EidUserData | undefined> {
  const axiosConfig: any = {
    method: "get",
    url: config.userinfo_endpoint,
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };

  try {
    const response = await axios.default(axiosConfig);
    let object: any = {};
    object = response.data;
    return object;
  } catch (err) {
    console.log("userinfo_endpoint error");
    console.error(err);
    return undefined;
  }
}
