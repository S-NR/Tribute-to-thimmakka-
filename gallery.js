const DB_URL = "https://tribute-to-thimmakka-1-default-rtdb.firebaseio.com/uploads.json";

async function loadGallery() {
    const galleryDiv = document.getElementById("gallery");
    const loadingDiv = document.getElementById("loading");

    loadingDiv.innerText = "Loading...";

    let res = await fetch(DB_URL);
    let data = await res.json();

    galleryDiv.innerHTML = "";
    loadingDiv.style.display = "none";

    if (!data) {
        loadingDiv.style.display = "block";
        loadingDiv.innerText = "No images uploaded yet.";
        return;
    }

    Object.values(data).forEach(item => {
        let img = document.createElement("img");
        img.src = item.url;
        img.className = "gallery-img";
        galleryDiv.appendChild(img);
    });
}

loadGallery();
