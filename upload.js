// upload.js
const CLOUD_NAME = "dtmzraoiz";
const UPLOAD_PRESET = "tribute_preset";

// If you want persistent public gallery, put your Firebase RTDB base URL here (no trailing slash).
// Example: "https://tribute-to-thimmakka-1-default-rtdb.firebaseio.com"
const FIREBASE_DB_URL = null; // <-- replace with your DB URL string if you set up Realtime DB

const uploadBtn = document.getElementById('uploadBtn');
const photoInput = document.getElementById('photoInput');
const statusEl = document.getElementById('status');
const nameEl = document.getElementById('name');
const preview = document.getElementById('preview');
const previewImg = document.getElementById('previewImg');

// show local preview when file chosen
photoInput.addEventListener('change', () => {
  const f = photoInput.files[0];
  if (!f) { preview.style.display = 'none'; return;}
  previewImg.src = URL.createObjectURL(f);
  preview.style.display = 'block';
});

uploadBtn.addEventListener('click', async () => {
  const file = photoInput.files[0];
  const person = (nameEl.value || "Anonymous").trim();

  if (!file) {
    statusEl.textContent = "Please choose a photo.";
    return;
  }

  statusEl.textContent = "Uploading to Cloudinary...";

  try {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);
    // optional: put into a folder
    form.append('folder', 'tribute_to_thimmakka');

    const cloudUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const cloudResp = await fetch(cloudUrl, { method: 'POST', body: form });
    if (!cloudResp.ok) {
      const text = await cloudResp.text();
      throw new Error('Cloudinary upload failed: ' + text);
    }
    const cloudData = await cloudResp.json();
    const imageUrl = cloudData.secure_url;

    statusEl.textContent = "Uploaded to Cloudinary.";

    // if FIREBASE_DB_URL provided, persist metadata there
    if (FIREBASE_DB_URL && FIREBASE_DB_URL.startsWith('https://')) {
      statusEl.textContent = "Saving metadata to database...";
      const meta = { name: person, url: imageUrl, timestamp: Date.now() };
      const dbRes = await fetch(`${FIREBASE_DB_URL}/photos.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meta)
      });
      if (!dbRes.ok) throw new Error('Saving to DB failed');
      statusEl.textContent = "Uploaded & saved. Thank you for joining #JaiThimmakka 🌿";
      // clear inputs
      photoInput.value = "";
      nameEl.value = "";
      preview.style.display = 'none';
    } else {
      // no DB: show immediate preview + provide a link
      statusEl.innerHTML = `Uploaded! <a href="${imageUrl}" target="_blank">Open image</a><br>
        Note: to make this image visible to everyone permanently, add a Firebase Realtime DB URL in upload.js.`;
      // keep preview as local (or set preview to uploaded image)
      previewImg.src = imageUrl;
      preview.style.display = 'block';
    }

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Upload failed: " + (err.message || err);
  }
});
