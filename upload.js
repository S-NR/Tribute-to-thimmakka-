const CLOUD_NAME = "dtmzraoiz";
const UPLOAD_PRESET = "tribute_preset";

// Save photos under "uploads"
const DB_URL = "https://tribute-to-thimmakka-1-default-rtdb.firebaseio.com/uploads.json";

document.getElementById("uploadForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const nomineesInput = document.getElementById("nominees"); // New input for nominee names

    if (fileInput.files.length === 0) {
        alert("Please select an image.");
        return;
    }

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const nominees = nomineesInput ? nomineesInput.value.trim() : "";

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    document.getElementById("status").innerText = "Uploading...";

    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "tribute_to_thimmakka");

    try {
        // Upload to Cloudinary
        let res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        });

        let data = await res.json();

        if (data.secure_url) {
            // Save URL + name + description + nominees in Firebase
            await fetch(DB_URL, {
                method: "POST",
                body: JSON.stringify({
                    url: data.secure_url,
                    name: name,
                    description: description,
                    nominees: nominees,
                    likes: 0,
                    comments: {}
                }),
                headers: { "Content-Type": "application/json" }
            });

            document.getElementById("status").innerText = "Uploaded Successfully!";
            fileInput.value = "";
            nameInput.value = "";
            if (descriptionInput) descriptionInput.value = "";
            if (nomineesInput) nomineesInput.value = "";
        } else {
            document.getElementById("status").innerText = "Upload failed!";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("status").innerText = "Upload failed!";
    }
});
