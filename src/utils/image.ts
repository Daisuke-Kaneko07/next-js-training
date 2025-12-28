import { writeFile } from "fs/promises";
import path from "path";

export async function saveImage(file: File): Promise<string | null> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}_${file.name}`;
  const uploadDir = path.join(process.cwd(), 'public/images');
  try {
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/images/${filename}`;
  } catch (error) {
    console.log(error)
    return null;
  }
}