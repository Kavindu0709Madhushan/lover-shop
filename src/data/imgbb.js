// Uploads a photo to ImgBB (https://imgbb.com) and returns a permanent,
// publicly reachable image URL. We store that URL in Firestore instead of
// the raw image data - much smaller documents, and the photo itself is
// served straight from ImgBB's own CDN, so it loads fast on any phone.
//
// Get a free API key at https://api.imgbb.com/ and put it in .env as
// VITE_IMGBB_API_KEY (see .env.example).

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export async function uploadImageToImgbb(file) {
  if (!IMGBB_API_KEY) {
    throw new Error(
      "Missing VITE_IMGBB_API_KEY. Add it to your .env file (see README.md)."
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error(`ImgBB upload failed (status ${res.status})`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error("ImgBB upload failed.");
  }

  // display_url is the direct, permanent link to the uploaded image.
  return data.data.display_url;
}
