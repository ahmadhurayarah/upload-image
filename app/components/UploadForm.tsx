"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import { Upload } from "../actions/Upload"; // Import the upload function

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      data.append("file", file);
      await Upload(data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Upload</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          name="file"
          onChange={handleChange}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <input
          type="submit"
          value="Upload"
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
        />
      </form>
    </main>
  );
}
