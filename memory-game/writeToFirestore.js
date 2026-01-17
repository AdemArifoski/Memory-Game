// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjThdV7DyAqUZ4Oej0UnS1lVcRdqADFeY",
  authDomain: "card-game-14ad4.firebaseapp.com",
  projectId: "card-game-14ad4",
  storageBucket: "card-game-14ad4.firebasestorage.app",
  messagingSenderId: "228953611751",
  appId: "1:228953611751:web:b4a64063b0c4b6c5c67142",
  measurementId: "G-QBSKEVVFGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const auth = getAuth(app)


document.addEventListener("DOMContentLoaded", () => {
  const provider = new GoogleAuthProvider();
  const googleButton = document.getElementById("googleButton");
  if (!googleButton) return;

  googleButton.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .catch(error =>{
        if (error.code === "auth/popup-closed-by-user") {
          console.log("User closed the popup without signing in.");
        } else {
          console.error("Login error:", error);
        }
      });
  });
});



export default async function writeToFirestore(data) {
  if (!auth.currentUser) {
    console.log("No user signed in. Cannot write data.");
    return;
  }

  try {
    const docRef = doc(db, "users", auth.currentUser.uid);

    await setDoc(docRef, {
      ...data,
      Date: serverTimestamp(),
    }, { merge: true });
    
    console.log("Firestore write successful");

  } catch (error) {
    console.error("Firestore error:", error);
    
  }

}


