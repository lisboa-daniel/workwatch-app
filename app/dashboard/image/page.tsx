"use client";
import { useRef } from "react";

export default function UploadForm() {
  const fileInput = useRef<HTMLInputElement>(null);

  async function uploadFile() {
    const formData = new FormData();
    const uploadedFile = fileInput?.current?.files?.[0];
  
    if (uploadedFile) {
      formData.append("file", uploadedFile);
      
      // Replace "<variable>" with the desired file name
      formData.append("fileName", "akiyama-mizuki.png");
  
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    }
  }
  
  
  return (
    <form className="flex flex-col gap-4">
      <label>
        <span>Upload a file</span>
        <input type="file" name="file" ref={fileInput} />
      </label>
      <button type="submit" onClick={uploadFile}>
        Enviar Imagem
      </button>

    </form>
  );
}
