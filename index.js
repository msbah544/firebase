import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

//firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDjAJqoFzXM2dSGYhDvqihZJLBE3JZhhJE",

  authDomain: "fir-9-8e77d.firebaseapp.com",

  projectId: "fir-9-8e77d",

  storageBucket: "fir-9-8e77d.appspot.com",

  messagingSenderId: "898613014588",

  appId: "1:898613014588:web:08beeb1265e70d54ac5339",
};

//init app
initializeApp(firebaseConfig);

//INIT SERVICES

//init firestore services
const db = getFirestore();

//init auth services
const auth = getAuth();

//collection reference
const colRef = collection(db, "books");

//queries(search by exact word)
//const q = query(colRef, where("title", "==", "Algebra"));

const q = query(colRef, orderBy("timeStamp", "desc"));

//real time collection data

/*getDocs(colRef)
  .then((snapshot) => {
    let books = [];
    snapshot.docs.map((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
  })
  .catch((err) => console.log(err.message));*/

const unsubCol = onSnapshot(q, colRef, (snapshot) => {
  let books = [];
  snapshot.docs.map((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

//add new doc
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    timeStamp: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting docs
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //refer to doc
  const docRef = doc(db, "books", deleteBookForm.id.value);

  //delete doc
  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

//get single doc

//refer to doc
const docRef = doc(db, "books", "kLXcHUduwn0Mzd8RAnlf");

/*getDoc(docRef)
  .then((doc) => console.log(doc.data(), doc.id))
  .catch((err) => console.log(err.message));*/

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

//update a doc
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //refer to doc
  const docRef = doc(db, "books", updateForm.id.value);
  //update
  updateDoc(docRef, {
    title: "update title test",
  }).then(() => {
    updateForm.reset();
  });
  //.catch((err) => console.log(err.message));
});

//signup user
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get email and password from frontend
  const email = signupForm.email.value;
  const password = signupForm.password.value;

  //signup
  createUserWithEmailAndPassword(auth, email, password)
    .then((creds) => {
      //console.log("user created:", creds.user);
      signupForm.reset();
    })
    .catch((err) => console.log(err.message));
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // console.log("user signed out");
    })
    .catch((err) => console.log(err.message));
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((creds) => {
      //console.log("user logged in:", creds.user);
      loginForm.reset();
    })
    .catch((err) => console.log(err.message));
});

//subscribe to AUTH changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log(user);
});

//unsubscribing from changes (auth & db)

const unsubBtn = document.querySelector(".unsub");
unsubBtn.addEventListener("click", () => {
  unsubCol();
  unsubDoc();
  unsubAuth();
});
