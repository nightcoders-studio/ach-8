// Upload gambar ke imgbb (https://api.imgbb.com/) lalu kembalikan URL publik.
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

export async function uploadToImgbb(file: File): Promise<string> {
  if (!IMGBB_KEY) {
    throw new Error(
      "NEXT_PUBLIC_IMGBB_KEY belum diatur. Tambahkan di file .env.local.",
    );
  }

  const body = new FormData();
  body.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
    { method: "POST", body },
  );

  const json = await res.json();
  if (!res.ok || !json?.success) {
    throw new Error(json?.error?.message || "Gagal mengunggah gambar ke imgbb");
  }
  return json.data.url as string;
}
