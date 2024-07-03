import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string; // Retrieve the file name parameter
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Use the file name parameter when saving the file
    await fs.writeFile(`./public/uploads/${fileName}`, buffer);

    revalidatePath("/");

    return NextResponse.json({ status: "success", image_path: `/${fileName}`});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}
