import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue }
        from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0FHjz-pllgQgmHC1Eykfj0tlmReAMLj8",
  authDomain: "tribute-to-thimmakka-1.firebaseapp.com",
  projectId: "tribute-to-thimmakka-1",
  storageBucket: "tribute-to-thimmakka-1.firebasestorage.app",
  messagingSenderId: "49417317822",
  appId: "1:49417317822:web:b30d2694275f6cde8dddef",
  measurementId: "G-JJ7MLTWSQP"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const gallery = document.getElementById("gallery");

const photosRef = ref(db, "photos/");
onValue(photosRef, (snapshot) => {
    gallery.innerHTML = "";

    snapshot.forEach((child) => {
        const data = child.val();

        const img = document.createElement("img");
        img.src = data.url;

        gallery.appendChild(img);
    });
});

