const DB_URL = "https://tribute-to-thimmakka-1-default-rtdb.firebaseio.com/uploads.json";

async function loadGallery() {
    const container = document.getElementById("gallery");
    container.innerHTML = "Loading...";

    let res = await fetch(DB_URL);
    let data = await res.json();

    container.innerHTML = "";

    if (!data) {
        container.innerHTML = "<p>No images uploaded yet.</p>";
        return;
    }

    Object.values(data).forEach(item => {
        let img = document.createElement("img");
        img.src = item.url;
        img.className = "gallery-img";
        container.appendChild(img);
    });
}

loadGallery();
