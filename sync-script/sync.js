const admin = require("firebase-admin");
const fetch = require("node-fetch");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 ignoreUndefinedProperties: true
});


const db = admin.firestore();

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1Ik841hYlchYjANuAnSoegC73vZguSccn3Tyz98oVZ9U/gviz/tq?tqx=out:json";

async function sync(){

 const response = await fetch(SHEET_URL);
 const text = await response.text();

 const json = JSON.parse(text.substr(47).slice(0,-2));
 const rows = json.table.rows;

 for (const row of rows) {

  const paper = {
    course: row.c[0]?.v || "",
    year: row.c[1]?.v || "",
    specialization: row.c[2]?.v || "",
    sem: row.c[3]?.v || "",
    exam: row.c[4]?.v || "",
    name: row.c[5]?.v || "",
    link: row.c[6]?.v || ""
  };

  // prevent empty data upload
  if (paper.course && paper.year && paper.sem && paper.exam) {
     await db.collection("papers").add(paper);
  }

}


 console.log("✅ Sync Complete");

}

sync();
