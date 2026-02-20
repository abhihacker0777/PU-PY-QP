const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

const db = admin.firestore();

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1Ik841hYlchYjANuAnSoegC73vZguSccn3Tyz98oVZ9U/gviz/tq?tqx=out:json";

exports.syncSheets = onSchedule("every 24 hours", async () => {

  const response = await fetch(SHEET_URL);
  const text = await response.text();

  const json = JSON.parse(text.substr(47).slice(0,-2));
  const rows = json.table.rows;

  const papers = rows.map(r => ({
    course: r.c[0]?.v || "",
    year: r.c[1]?.v || "",
    specialization: r.c[2]?.v || "",
    sem: r.c[3]?.v || "",
    exam: r.c[4]?.v || "",
    name: r.c[5]?.v || "",
    link: r.c[6]?.v || ""
  }));

  const batch = db.batch();

  papers.forEach(paper => {
    const ref = db.collection("papers").doc();
    batch.set(ref, paper);
  });

  await batch.commit();

  console.log("Sheets synced to Firestore ✅");

});
