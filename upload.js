// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
        from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getDatabase, push, ref as dbRef, set }
        from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0FHjz-pllgQgmHC1Eykfj0tlmReAMLj8",
  authDomain: "tribute-to-thimmakka-1.firebaseapp.com",
  projectId: "tribute-to-thimmakka-1",
  // storageBucket: "tribute-to-thimmakka-1.firebasestorage.app",
  storageBucket: "tribute-to-thimmakka-1.appspot.com",
  messagingSenderId: "49417317822",
  appId: "1:49417317822:web:b30d2694275f6cde8dddef",
  measurementId: "G-JJ7MLTWSQP"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);

window.uploadImage = async function () {
    const name = document.getElementById("name").value;
    const file = document.getElementById("photoInput").files[0];
    const status = document.getElementById("status");

    if (!name || !file) {
        status.textContent = "Please enter a name and choose a photo.";
        return;
    }

    status.textContent = "Uploading...";

    try {
        const storageRef = ref(storage, "uploads/" + Date.now() + "_" + file.name);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const newRef = push(dbRef(db, "photos/"));
        await set(newRef, {
            name: name,
            url: downloadURL,
            timestamp: Date.now()
        });

        status.textContent = "Uploaded successfully!";
    } 
    catch (error) {
        console.error(error);
        status.textContent = "Upload failed!";
    }
}

