
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* 🔥 PASTE YOUR FIREBASE CONFIG HERE */
const firebaseConfig = {
  apiKey: "AIzaSyBSoQ_np-n6qMkWEMvbzHyXZTiXPlXbgbk",
  authDomain: "pu-py-qp.firebaseapp.com",
  projectId: "pu-py-qp",
  storageBucket: "pu-py-qp.firebasestorage.app",
  messagingSenderId: "650783354497",
  appId: "1:650783354497:web:4cb4c53b70778fce45a780",
  measurementId: "G-RPRNMFH2B6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

var selected = {};

// ORDER SEQUENCE
const courseSequence = [
"B.Arch","B.Com","B.Des","B.Sc","B.Tech","BA","BBA","BCA","BVA",
"M.Plan","M.Tech","MA","MBA","MCA","MPH","MVA","Ph.D","PIHM"
];

const yearSequence = ["1 Year","2 Year","3 Year","4 Year","5 Year"];

const semSequence = ["1 Sem","2 Sem","3 Sem","4 Sem","5 Sem","6 Sem","7 Sem","8 Sem","9 Sem","10 Sem"];

const examSequence = ["MSE","ESE"];

let papersData = [];

async function loadFirebaseData(){

 const loader = document.getElementById("loader");
 const coursesSection = document.getElementById("coursesSection");

 loader.style.display = "block";
 coursesSection.style.display = "none";

 try {

   const cached = localStorage.getItem("papersCache");

   if(cached){
     papersData = JSON.parse(cached);
   } else {
     const querySnapshot = await getDocs(collection(db, "papers"));

     papersData = [];

     querySnapshot.forEach(doc => {
       papersData.push(doc.data());
     });

     localStorage.setItem("papersCache", JSON.stringify(papersData));
   }

   loadCourses();

   loader.style.display = "none";
   coursesSection.style.display = "block";

 } catch(e){
   console.error("Error:", e);
   loader.innerText = "Failed to load data";
 }
}

loadFirebaseData();

function unique(field, filter={}){
 return [...new Set(
  papersData
  .filter(p=>Object.keys(filter).every(k=>p[k]==filter[k]))
  .map(p=>p[field])
 )];
}

function ordered(list, sequence){
 return sequence.filter(v=>list.includes(v));
}

function renderCards(id, list, type){
 let html="";
 list.forEach(v=>{
  html += `<div class="card" onclick="select('${type}','${v}',this)">${v}</div>`;
 });
 document.getElementById(id).innerHTML = html;
}

function select(type,value,el){

selected[type]=value;



document.querySelectorAll("#"+type+" .card")
.forEach(c=>c.classList.remove("active"));

if(el) el.classList.add("active");


// COURSE SELECTED
if(type=="course"){

   delete selected.year;
   delete selected.specialization;
   delete selected.sem;
   delete selected.exam;

   year.innerHTML="";
   specialization.innerHTML="";
   sem.innerHTML="";
   exam.innerHTML="";
   papers.innerHTML="";

   year.classList.remove("hidden");
   yearTitle.classList.remove("hidden");

   specialization.classList.add("hidden");
   specializationTitle.classList.add("hidden");
   sem.classList.add("hidden");
   semTitle.classList.add("hidden");
   exam.classList.add("hidden");
   examTitle.classList.add("hidden");
   papers.classList.add("hidden");
   papersTitle.classList.add("hidden");

   loadYears();
}


// YEAR SELECTED
else if(type=="year"){

   delete selected.specialization;
   delete selected.sem;
   delete selected.exam;

   specialization.innerHTML="";
   sem.innerHTML="";
   exam.innerHTML="";
   papers.innerHTML="";

   specialization.classList.remove("hidden");
   specializationTitle.classList.remove("hidden");

   sem.classList.add("hidden");
   semTitle.classList.add("hidden");
   exam.classList.add("hidden");
   examTitle.classList.add("hidden");
   papers.classList.add("hidden");
   papersTitle.classList.add("hidden");

   loadSpecializations();
}


// SPECIALIZATION SELECTED
else if(type=="specialization"){

   delete selected.sem;
   delete selected.exam;

   sem.innerHTML="";
   exam.innerHTML="";
   papers.innerHTML="";

   sem.classList.remove("hidden");
   semTitle.classList.remove("hidden");

   exam.classList.add("hidden");
   examTitle.classList.add("hidden");
   papers.classList.add("hidden");
   papersTitle.classList.add("hidden");

   loadSems();
}


// SEM SELECTED
else if(type=="sem"){

   delete selected.exam;

   exam.innerHTML="";
   papers.innerHTML="";

   exam.classList.remove("hidden");
   examTitle.classList.remove("hidden");

   papers.classList.add("hidden");
   papersTitle.classList.add("hidden");

   loadExams();
}


// EXAM SELECTED
else if(type=="exam"){

   papers.classList.remove("hidden");
   papersTitle.classList.remove("hidden");

   loadPapers();
}

}

window.select = select;

function loadCourses(){
 let available = unique("course");
 renderCards("course", ordered(available, courseSequence), "course");
}

function loadYears(){
 let available = unique("year", {course:selected.course});
 renderCards("year", ordered(available, yearSequence), "year");
}

function loadSpecializations(){
 renderCards("specialization", unique("specialization", {course:selected.course,year:selected.year}), "specialization");
}

function loadSems(){
 let available = unique("sem", selected);
 renderCards("sem", ordered(available, semSequence), "sem");
}

function loadExams(){
 let available = unique("exam", selected);
 renderCards("exam", ordered(available, examSequence), "exam");
}

function loadPapers(){
 let html="";
 papersData.filter(p=>Object.keys(selected).every(k=>p[k]==selected[k]))
 .forEach(p=>{
  html+=`<div class="paper">📄 <a href="${p.link}" target="_blank">${p.name}</a></div>`;
 });
 document.getElementById("papers").innerHTML=html;
}