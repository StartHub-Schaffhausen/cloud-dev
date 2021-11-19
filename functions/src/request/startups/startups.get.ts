/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";

import fetch from "node-fetch";

import * as htmlToText from "html-to-text";
// import DocumentData = admin.firestore.DocumentData;
// import QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;

// const db = admin.firestore();

import * as express from "express";
import * as cors from "cors";
const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// https://europe-west6-starthub-schaffhausen-dev.cloudfunctions.net/startups?type=all&from=2021-08-01&to=2021-08-31
export function getStartups(request: functions.Request, response: functions.Response<any[] | any>) {
  const corsHandler = cors({
    origin: true,
  });

  corsHandler(request, response, async () => {
    try {
      console.log(request.query.type);
      console.log(request.query.from);
      console.log(request.query.to);
      const type = request.query.type;
      const dateFrom = request.query.from as string;
      const dateTo = request.query.to as string;

      console.log("using dates: " + dateFrom + " / " + dateTo);

      const dateFromISO = new Date(dateFrom).toISOString().slice(0.10);
      const dateToISO = new Date(dateTo).toISOString().slice(0.10);
      console.log("using ISO dates: " + dateFromISO + " / " + dateToISO);

      // const body = "";
      let legalForm = [4];
      switch (type) {
        case "ef":
          legalForm = [1];
          break;
        case "klg":
          legalForm = [2];
          break;
        case "ag":
          legalForm = [3];
          break;
        case "gmbh":
          legalForm = [4];
          break;
        case "all":
          legalForm = [1, 2, 3, 4];
          break;
        default:
          legalForm = [4];
      }

      // registryOffices\":[290] = Schaffhausen
      // registryOffices\":[20] = Zürich
      // registryOffices\":[440] = Thurgau

      /* LEGAL SEATS
    Gemeinden LegalSeats
    Neuhausen am Rheinfall 1306
    Thayngen 1300
    Schaffhausen 1308
    Wilchingen 1319
    Hallau 1316
    Buchberg 1303
    Ramsen 1314
    Stein am Rhein 1315
    Hemishofen 1313
    Trasadingen 1318
    Beringen 1302
    Löhningen 1288
    Stetten (SH) 1299
    Lohn (SH) 1297
    Büttenhard 1294
    Siblingen 1311
    Gächlingen 1286
    Merishausen 1305
    Bargen (SH) 1301
    Schleitheim 1310
    Beggingen 1309
    Neunkirch 1289
    Oberhallau 1317
    Bibern 1300
    Hofen 1300
    Opfertshofen
    Altdorf
    Dörflingen 1295

    Laufen-Uhwiesen 31
    Flurlingen 26
    Andelfingen 27
    Feuerthalen 24
    Dachsen 22
    Marthalen 32
    Trüllikon 37
    Benken (ZH) 19
    Stammheim 3050

    Schlatt (TG) 1977
    Diessenhofen 2908
    Basadingen-Schlattingen 1974
    Eschenz 1835

    Zugang:
    Test: https://www.zefixintg.admin.ch/ZefixPublicREST/
    Produktion: https://www.zefix.admin.ch/ZefixPublicREST/
    Benutzername: sandro@starthub.sh
    Passwort:
    */

      // const myHeaders = new Headers();
      // myHeaders.append("Accept", " application/json, text/plain, */*");
      // myHeaders.append("Content-Type", " application/json;charset=UTF-8");

      // const raw = "{\r\n    \"publicationDate\": \"2021-08-01\",\r\n    \"publicationDateEnd\": \"2021-08-31\",\r\n    \"legalForms\": [1,2,3,4],\r\n    \"legalSeats\": [1306, 1300, 1308, 1319, 1316, 1303, 1314, 1315, 1313, 1318, 1302, 1288, 1299, 1297, 1294, 1311, 1286, 1305, 1301, 1310, 1309, 1289, 1317, 1300, 1300, 1295, 31, 26, 27, 24, 22, 32, 37, 19, 3050, 1977, 2908, 1974, 1835],\r\n    \"maxEntries\": 60,\r\n    \"muationTypes\": [2]\r\n}";
      const raw = {
        "publicationDate": dateFromISO,
        "publicationDateEnd": dateToISO,
        "legalForms": legalForm,
        "legalSeats": [1306, 1300, 1308, 1319, 1316, 1303, 1314, 1315, 1313, 1318, 1302, 1288, 1299, 1297, 1294, 1311, 1286, 1305, 1301, 1310, 1309, 1289, 1317, 1300, 1300, 1295, 31, 26, 27, 24, 22, 32, 37, 19, 3050, 1977, 2908, 1974, 1835],
        "maxEntries": 60,
        "muationTypes": [2],
        "offset": 0,
      };

      /*  const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow",
      }; */

      // mod.cjs
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fetch("https://www.zefix.ch/ZefixREST/api/v1/shab/search.json", {
        method: "POST",
        body: JSON.stringify(raw),
        // headers: myHeaders
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
        },
        redirect: "follow",
      })
          .then((response:any) => response.json())
          .then((json:any) => {
            // console.log(json)
            let data = [];
            if (json && json.list && json.list.length) {
              // console.log(type + ": " + json.list.length + " entries fetched");
              data = convertHtml(json.list);
            }
            if (json.error) {
              console.log(type + ": " + json.error.suggestion);
            }
            response.json(data);
          })
          .catch((error:any) => {
            console.log("error ", error);
            response.send("starthub backend error");
          });


    /*  fetch("https://www.zefix.ch/ZefixREST/api/v1/shab/search.json", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow",
      })
          .then((response) => response.json())
          .then((json:any) => {
            // console.log(json)
            let data = [];
            if (json && json.list && json.list.length) {
              // console.log(type + ": " + json.list.length + " entries fetched");
              data = convertHtml(json.list);
            }
            if (json.error) {
              console.log(type + ": " + json.error.suggestion);
            }
            response.json(data);
          })
          .catch((error) => {
            console.log("error", error);
            response.send("starthub backend error");
          });
          */
      // response.send("Einzelunternehmen ef | Kollektivgesellschaft kig | Aktiengesellschaft ag | GmbH gmbh");
    } catch (err) {
      response.status(500).json({
        error: err,
      });
    }
  });
}

// https://europe-west6-starthub-schaffhausen-dev.cloudfunctions.net/startups?type=all&from=2021-08-01&to=2021-08-31
export function getPrintStartups(request: functions.Request, response: functions.Response<any[] | any>) {
  const corsHandler = cors({
    origin: true,
  });

  corsHandler(request, response, async () => {
    try {
      console.log(request.query.type);
      console.log(request.query.from);
      console.log(request.query.to);
      const type = request.query.type;
      const dateFrom = request.query.from as string;
      const dateTo = request.query.to as string;

      console.log("using dates: " + dateFrom + " / " + dateTo);

      const dateFromISO = new Date(dateFrom).toISOString().slice(0.10);
      const dateToISO = new Date(dateTo).toISOString().slice(0.10);
      console.log("using ISO dates: " + dateFromISO + " / " + dateToISO);

      // const body = "";
      let legalForm = [4];
      switch (type) {
        case "ef":
          legalForm = [1];
          break;
        case "klg":
          legalForm = [2];
          break;
        case "ag":
          legalForm = [3];
          break;
        case "gmbh":
          legalForm = [4];
          break;
        case "all":
          legalForm = [1, 2, 3, 4];
          break;
        default:
          legalForm = [4];
      }

      // registryOffices\":[290] = Schaffhausen
      // registryOffices\":[20] = Zürich
      // registryOffices\":[440] = Thurgau

      /* LEGAL SEATS
      Gemeinden LegalSeats
      Neuhausen am Rheinfall 1306
      Thayngen 1300
      Schaffhausen 1308
      Wilchingen 1319
      Hallau 1316
      Buchberg 1303
      Ramsen 1314
      Stein am Rhein 1315
      Hemishofen 1313
      Trasadingen 1318
      Beringen 1302
      Löhningen 1288
      Stetten (SH) 1299
      Lohn (SH) 1297
      Büttenhard 1294
      Siblingen 1311
      Gächlingen 1286
      Merishausen 1305
      Bargen (SH) 1301
      Schleitheim 1310
      Beggingen 1309
      Neunkirch 1289
      Oberhallau 1317
      Bibern 1300
      Hofen 1300
      Opfertshofen
      Altdorf
      Dörflingen 1295

      Laufen-Uhwiesen 31
      Flurlingen 26
      Andelfingen 27
      Feuerthalen 24
      Dachsen 22
      Marthalen 32
      Trüllikon 37
      Benken (ZH) 19
      Stammheim 3050

      Schlatt (TG) 1977
      Diessenhofen 2908
      Basadingen-Schlattingen 1974
      Eschenz 1835

      Zugang:
      Test: https://www.zefixintg.admin.ch/ZefixPublicREST/
      Produktion: https://www.zefix.admin.ch/ZefixPublicREST/
      Benutzername: sandro@starthub.sh
      Passwort: S&MgKQLW
      */

      // const myHeaders = new Headers();
      // myHeaders.append("Accept", " application/json, text/plain, */*");
      // myHeaders.append("Content-Type", " application/json;charset=UTF-8");

      // const raw = "{\r\n    \"publicationDate\": \"2021-08-01\",\r\n    \"publicationDateEnd\": \"2021-08-31\",\r\n    \"legalForms\": [1,2,3,4],\r\n    \"legalSeats\": [1306, 1300, 1308, 1319, 1316, 1303, 1314, 1315, 1313, 1318, 1302, 1288, 1299, 1297, 1294, 1311, 1286, 1305, 1301, 1310, 1309, 1289, 1317, 1300, 1300, 1295, 31, 26, 27, 24, 22, 32, 37, 19, 3050, 1977, 2908, 1974, 1835],\r\n    \"maxEntries\": 60,\r\n    \"muationTypes\": [2]\r\n}";
      const raw = {
        "publicationDate": dateFromISO,
        "publicationDateEnd": dateToISO,
        "legalForms": legalForm,
        "legalSeats": [1306, 1300, 1308, 1319, 1316, 1303, 1314, 1315, 1313, 1318, 1302, 1288, 1299, 1297, 1294, 1311, 1286, 1305, 1301, 1310, 1309, 1289, 1317, 1300, 1300, 1295, 31, 26, 27, 24, 22, 32, 37, 19, 3050, 1977, 2908, 1974, 1835],
        "maxEntries": 60,
        "muationTypes": [2],
        "offset": 0,
      };

      /*  const requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(raw),
          redirect: "follow",
        }; */

      // mod.cjs
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fetch("https://www.zefix.ch/ZefixREST/api/v1/shab/search.json", {
        method: "POST",
        body: JSON.stringify(raw),
        // headers: myHeaders
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
        },
        redirect: "follow",
      })
          .then((response:any) => response.json())
          .then((json:any) => {
            // console.log(json)
            let data = [];
            if (json && json.list && json.list.length) {
              // console.log(type + ": " + json.list.length + " entries fetched");
              data = convertHtml(json.list);
            }
            if (json.error) {
              console.log(type + ": " + json.error.suggestion);
            }
            response.json(data);
          })
          .catch((error:any) => {
            console.log("error ", error);
            response.send("starthub backend error");
          });


      /*  fetch("https://www.zefix.ch/ZefixREST/api/v1/shab/search.json", {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(raw),
          redirect: "follow",
        })
            .then((response) => response.json())
            .then((json:any) => {
              // console.log(json)
              let data = [];
              if (json && json.list && json.list.length) {
                // console.log(type + ": " + json.list.length + " entries fetched");
                data = convertHtml(json.list);
              }
              if (json.error) {
                console.log(type + ": " + json.error.suggestion);
              }
              response.json(data);
            })
            .catch((error) => {
              console.log("error", error);
              response.send("starthub backend error");
            });
            */
      // response.send("Einzelunternehmen ef | Kollektivgesellschaft kig | Aktiengesellschaft ag | GmbH gmbh");
    } catch (err) {
      response.status(500).json({
        error: err,
      });
    }
  });
}
function convertHtml(list: any) {
  for (const listEl in list) {
    for (const pubEl in list[listEl].shabPub) {
      list[listEl].shabPub[pubEl].message = htmlToText.fromString(list[listEl].shabPub[pubEl].message);
      list[listEl].shabPub[pubEl].pdfLink = "https://www.shab.ch/shabforms/servlet/Search?EID=7&DOCID=" + list[listEl].shabPub[pubEl].shabId;
    }
  }
  return list;
}
