// Cloudinary upload URL
const CLOUD_NAME = "dtmzraoiz";
const PRESET = "tribute_preset";

async function uploadImage() {
    const name = document.getElementById("name").value;
    const file = document.getElementById("photoInput").files[0];
    const status = document.getElementById("status");

    if (!name || !file) {
        status.textContent = "Enter name & select a photo!";
        return;
    }

    status.textContent = "Uploading...";

    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", PRESET);

    // Upload to Cloudinary
    let response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );

    let data = await response.json();
    let imageURL = data.secure_url;

    // Store URL in Firebase
    firebase.database().ref("photos").push({
        name: name,
        url: imageURL,
        time: Date.now()
    });

    status.textContent = "Uploaded!";
}

// Load images into gallery
firebase.database().ref("photos").on("value", snapshot => {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    snapshot.forEach(child => {
        let info = child.val();

        let img = document.createElement("img");
        img.src = info.url;
        img.title = info.name;

        gallery.appendChild(img);
    });
});
