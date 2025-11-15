const FIREBASE_DB_URL = "https://tribute-to-thimmakka-1-default-rtdb.firebaseio.com/";

async function loadGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "Loading images... 🌿";

    const res = await fetch(`${FIREBASE_DB_URL}/photos.json`);
    const data = await res.json();

    if (!data) {
        gallery.innerHTML = "<p>No photos uploaded yet.</p>";
        return;
    }

    gallery.innerHTML = "";

    // Convert object → array
    const photos = Object.values(data).reverse(); // Newest first

    photos.forEach(item => {
        const card = document.createElement("div");
        card.className = "photo-card";

        card.innerHTML = `
            <img src="${item.url}" alt="Uploaded Photo" />
            <h3>${item.name}</h3>
            <p>${new Date(item.timestamp).toLocaleString()}</p>
        `;

        gallery.appendChild(card);
    });
}

loadGallery();
