// gallery.js
const FIREBASE_DB_URL = null; // <-- replace with your DB URL string if you want persistent gallery

const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');

function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

async function loadGallery() {
  if (!FIREBASE_DB_URL || !FIREBASE_DB_URL.startsWith('https://')) {
    loading.textContent = "Gallery requires a small free Firebase Realtime DB to be persistent.\nPlease add your DB URL to gallery.js to enable the public gallery.";
    return;
  }

  loading.textContent = "Loading gallery...";
  try {
    const res = await fetch(`${FIREBASE_DB_URL}/photos.json`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    const data = await res.json();
    gallery.innerHTML = '';
    if (!data) {
      loading.textContent = "No photos yet — be the first!";
      return;
    }
    // convert to array + sort newest first
    const arr = Object.keys(data).map(k => ({ id: k, ...data[k] })).sort((a,b)=> (b.timestamp||0) - (a.timestamp||0));
    arr.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      const name = escapeHtml(item.name || 'Anonymous');
      const time = item.timestamp ? new Date(item.timestamp).toLocaleString() : '';
      card.innerHTML = `
        <img loading="lazy" src="${item.url}" alt="${name}" />
        <div class="meta"><strong>${name}</strong><br><time>${time}</time></div>
      `;
      gallery.appendChild(card);
    });
    loading.textContent = '';
  } catch (err) {
    console.error(err);
    loading.textContent = 'Could not load gallery';
  }
}

loadGallery();
