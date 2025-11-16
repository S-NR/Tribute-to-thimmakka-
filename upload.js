const CLOUD_NAME = "dtmzraoiz";
const UPLOAD_PRESET = "tribute_preset";

// Save photos under "photos" (not uploads)
const DB_URL = "https://tribute-to-thimmakka-1-default-rtdb.firebaseio.com/photos.json";

document.getElementById("uploadForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) {
        alert("Please select an image.");
        return;
    }

    document.getElementById("status").innerText = "Uploading...";

    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "tribute_to_thimmakka");

    // Upload to Cloudinary
    let res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
    });

    let data = await res.json();

    if (data.secure_url) {
        // Save URL in the SAME path gallery reads
        await fetch(DB_URL, {
            method: "POST",
            body: JSON.stringify({ url: data.secure_url }),
            headers: { "Content-Type": "application/json" }
        });

        document.getElementById("status").innerText = "Uploaded Successfully!";
        fileInput.value = "";
    } else {
        document.getElementById("status").innerText = "Upload failed!";
    }
});
