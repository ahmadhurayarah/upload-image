"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import Image from "next/image";
import { Upload } from "../actions/Upload"; // Import the upload function

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    const response = await fetch("/api/images");
    if (response.ok) {
      const imageList: string[] = await response.json();
      const sortedImages = imageList.sort((a: string, b: string) =>
        b.localeCompare(a)
      );
      localStorage.setItem("cachedImages", JSON.stringify(sortedImages));
      setImages(sortedImages);
    }
  };

  useEffect(() => {
    const cachedImages = localStorage.getItem("cachedImages");
    if (cachedImages) {
      setImages(JSON.parse(cachedImages));
    }
    fetchImages();
  }, []);

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
      fetchImages();
    }
  };

  const handleDelete = async (key: string) => {
    const response = await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    if (response.ok) {
      fetchImages();
    } else {
      console.error("Failed to delete image");
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload</h1>
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
      <div>
        <h2 className="text-2xl font-semibold mb-4">Uploaded Images</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <li key={index} className="relative group">
              <Image
                src={`https://wizxaibucket.s3.amazonaws.com/${image}`}
                alt={`Uploaded ${image}`}
                width={200}
                height={200}
                className="w-full h-auto rounded"
              />
              <button
                onClick={() => handleDelete(image)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
