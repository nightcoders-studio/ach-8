// Upload gambar ke Cloudinary memakai UNSIGNED upload preset.
// Hanya butuh cloud name + nama preset (keduanya aman di sisi klien).
// API Secret TIDAK dipakai di frontend agar tidak bocor ke publik.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary belum dikonfigurasi. Isi NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME & NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET di .env.local.",
    );
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body },
  );

  const json = await res.json();
  if (!res.ok || !json?.secure_url) {
    throw new Error(json?.error?.message || "Gagal mengunggah gambar ke Cloudinary");
  }
  return json.secure_url as string;
}
