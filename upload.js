// Cloudinary details
const CLOUD_NAME = "dtmzraoiz";
const UPLOAD_PRESET = "tribute_preset";

// Your Firebase Realtime Database URL
const FIREBASE_DB_URL = "https://tribute-to-thimmakka-1-default-rtdb.firebaseio.com/";

// Upload function
async function uploadImage() {
    const name = document.getElementById("name").value;
    const file = document.getElementById("photoInput").files[0];
    const status = document.getElementById("status");

    if (!name || !file) {
        status.textContent = "Please enter your name and select a photo 🌿";
        return;
    }

    status.textContent = "Uploading... Please wait 🌱";

    // Prepare form data for Cloudinary
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        // Upload to Cloudinary
        const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const cloudinaryData = await cloudinaryRes.json();
        if (!cloudinaryData.secure_url) throw new Error("Upload failed");

        // Save URL + name to Firebase
        const photoData = {
            name: name,
            url: cloudinaryData.secure_url,
            timestamp: Date.now()
        };

        await fetch(`${FIREBASE_DB_URL}/photos.json`, {
            method: "POST",
            body: JSON.stringify(photoData)
        });

        status.textContent = "Uploaded successfully! 🎉";
        document.getElementById("photoInput").value = "";
        document.getElementById("name").value = "";

    } catch (error) {
        console.error(error);
        status.textContent = "❌ Upload failed. Try again.";
    }
}
