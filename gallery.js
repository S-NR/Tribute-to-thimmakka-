// Correct Firebase uploads path
const DB_URL = "https://tribute-to-thimmakka-1-default-rtdb.firebaseio.com/uploads.json";

async function loadGallery() {
    const galleryDiv = document.getElementById("gallery");
    const loadingDiv = document.getElementById("loading");

    loadingDiv.innerText = "Loading...";

    try {
        let res = await fetch(DB_URL);
        let data = await res.json();

        galleryDiv.innerHTML = "";
        loadingDiv.style.display = "none";

        if (!data) {
            loadingDiv.style.display = "block";
            loadingDiv.innerText = "No images uploaded yet.";
            return;
        }

        // Loop through all uploaded items
        Object.values(data).forEach(item => {
            let card = document.createElement("div");
            card.className = "photo-card";

            let img = document.createElement("img");
            img.src = item.url;    // <-- FIXED
            img.className = "gallery-img";

            card.appendChild(img);
            galleryDiv.appendChild(card);
        });

    } catch (e) {
        loadingDiv.innerText = "Error loading gallery.";
        console.error(e);
    }
}

// Load on page open
loadGallery();
