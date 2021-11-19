/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import {EventContext} from "firebase-functions";
import * as moment from "moment";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const db = admin.firestore();

const wordpress = require( "wordpress" );

export async function monthlyStartupNewsletter(context: EventContext) {
  try {
    console.log("MONTHLY NEWSLETTER");
    const now = moment();
    const date = now.subtract(1, "months"); // 7 months, 7 days and 7 seconds ago

    const now2 = moment();
    const dateNow = now2.subtract(1, "days");
    // let dateNow = new Date();

    fetch("https://europe-west6-starthub-schaffhausen.cloudfunctions.net/api/startups?type=all&from=" + date.toISOString().slice(0, 10) + "&to=" + dateNow.toISOString().slice(0, 10), {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json;charset=UTF-8",
      },
      "method": "GET",
      "mode": "cors",
    }).then((res) => res.json())
        .then(async (json) => {
          let startupString = "";
          for (const startup of json) {
            // console.log(startup.name);

            if (startup.address.careOf) {
              startupString = startupString + "<li><b>" + startup.name + "</b> - " + startup.uid + " / " + String(startup.shabDate).substr(8, 2) + "." + String(startup.shabDate).substr(5, 2) + "." + String(startup.shabDate).substr(0, 4) + "</br> (" + startup.address.organisation + ", " + startup.address.careOf + ", " + startup.address.street + " " + startup.address.houseNumber + ", " + startup.address.swissZipCode + " " + startup.address.town + ")";
            } else {
              startupString = startupString + "<li><b>" + startup.name + "</b> - " + startup.uid + " / " + String(startup.shabDate).substr(8, 2) + "." + String(startup.shabDate).substr(5, 2) + "." + String(startup.shabDate).substr(0, 4) + "</br> (" + startup.address.organisation + ", " + startup.address.street + " " + startup.address.houseNumber + ", " + startup.address.swissZipCode + " " + startup.address.town + ")";
            }
            // Add purpose
            startupString = startupString + "<p>" + startup.purpose + "</p>" + "</br>" + "</li>";
          }

          const partnerRef = await db.collection("partnerprogramm").where("active", "==", true).where("monthly", "==", true).get();
          partnerRef.forEach(async (partner) => {
            await db.collection("mail").add({
              to: partner.data().email,
              template: {
                name: "PartnerMonthlyNewsletter",
                data: {
                  firstName: partner.data().firstName,
                  lastName: partner.data().lastName,
                  startupString: startupString,
                },
              },
            });
          });

          // createWordPressPage(json);
        }); // fetch Ende
  } catch (err) {
    console.error(err);
  }
}

/* EVERY MONDAY */
export async function weeklyStartupNewsletter(context: EventContext) {
  try {
    console.log("WEEKLY NEWSLETTER - EVERY MONDAY");
    // calculate TimeStamps for request:
    const now = moment();
    const date = now.subtract(7, "days"); // 7 months, 7 days and 7 seconds ago

    const now2 = moment();
    const dateNow = now2.subtract(1, "days");
    // let dateNow = new Date();

    fetch("https://europe-west6-starthub-schaffhausen.cloudfunctions.net/api/startups?type=all&from=" + date.toISOString().slice(0, 10) + "&to=" + dateNow.toISOString().slice(0, 10), {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json;charset=UTF-8",
      },
      "method": "GET",
      "mode": "cors",
    }).then((res) => res.json())
        .then(async (json) => {
          let startupString = "";
          for (const startup of json) {
            // console.log(startup.name);

            if (startup.address.careOf) {
              startupString = startupString + "<li><b>" + startup.name + "</b> - " + startup.uid + " / " + String(startup.shabDate).substr(8, 2) + "." + String(startup.shabDate).substr(5, 2) + "." + String(startup.shabDate).substr(0, 4) + "</br> (" + startup.address.organisation + ", " + startup.address.careOf + ", " + startup.address.street + " " + startup.address.houseNumber + ", " + startup.address.swissZipCode + " " + startup.address.town + ")";
            } else {
              startupString = startupString + "<li><b>" + startup.name + "</b> - " + startup.uid + " / " + String(startup.shabDate).substr(8, 2) + "." + String(startup.shabDate).substr(5, 2) + "." + String(startup.shabDate).substr(0, 4) + "</br> (" + startup.address.organisation + ", " + startup.address.street + " " + startup.address.houseNumber + ", " + startup.address.swissZipCode + " " + startup.address.town + ")";
            }
            // Add purpose
            startupString = startupString + "<p>" + startup.purpose + "</p>" + "</br>" + "</li>";
          }

          const partnerRef = await db.collection("partnerprogramm").where("active", "==", true).where("weekly", "==", true).get();
          partnerRef.forEach(async (partner) => {
            await db.collection("mail").add({
              to: partner.data().email,
              template: {
                name: "PartnerWeeklyNewsletter",
                data: {
                  firstName: partner.data().firstName,
                  lastName: partner.data().lastName,
                  startupString: startupString,
                },
              },
            });
          });

          // createWordPressPage(json, date, dateNow);
        }); // fetch Ende
  } catch (err) {
    console.error(err);
  }
}


function createWordPressPage(json: any) {
  let startupString = "";
  for (const startup of json) {
    // console.log(startup.name);
    if (startup.address.careOf) {
      startupString = startupString + "<li><b>" + startup.name + "</b> - " + startup.uid + " / " + String(startup.shabDate).substr(8, 2) + "." + String(startup.shabDate).substr(5, 2) + "." + String(startup.shabDate).substr(0, 4) + "</br> (" + startup.address.organisation + ", " + startup.address.careOf + ", " + startup.address.street + " " + startup.address.houseNumber + ", " + startup.address.swissZipCode + " " + startup.address.town + ")";
    } else {
      startupString = startupString + "<li><b>" + startup.name + "</b> - " + startup.uid + " / " + String(startup.shabDate).substr(8, 2) + "." + String(startup.shabDate).substr(5, 2) + "." + String(startup.shabDate).substr(0, 4) + "</br> (" + startup.address.organisation + ", " + startup.address.street + " " + startup.address.houseNumber + ", " + startup.address.swissZipCode + " " + startup.address.town + ")";
    }
    // Add purpose
    startupString = startupString + "<p>" + startup.purpose + "</p>" + "</br>" + "</li>";
  }


  const client = wordpress.createClient({
    url: "https://www.starthub.sh",
    username: functions.config().wordpress.username,
    password: functions.config().wordpress.password,
  });

  client.newPost({
    type: "page",
    title: "Gründungen " + moment().subtract(1, "day").locale("de").format("MMM YYYY"),
    content: startupString,
    status: "publish",
    slug: "gruendungen-" + moment().subtract(1, "day").locale("de").format("YYYY") + "-" + moment().subtract(1, "day").locale("de").format("MM"),
    parent: 1998,
  }, function(error:any, data:any) {
    if (error) {
      console.log(error);
    }

    console.log("Post sent! The server replied with the following:\n");
    console.log(data);
    console.log("\n");
  });

  /* client.getPosts(function( error, posts ) {
        for (let post of posts){
            console.log(JSON.stringify(post));
        }
    });*/
}
