"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import { Upload } from "../actions/Upload"; // Import the upload function
import { IoCloseCircle } from "react-icons/io5";
import Image from "next/image";
import { BarLoader } from "react-spinners";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State for loading
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  const deleteImage = () => {
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      setLoading(true); // Start loading
      const data = new FormData();
      data.append("file", file);
      await Upload(data);
      setFile(null);
      setImagePreview(null);
      setLoading(false); // Stop loading
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Upload Image</h1>
      {loading && (
        <div className="mb-4">
          <BarLoader color="#36d7b7" loading={loading} width="100%" />
        </div>
      )}
      <form onSubmit={handleSubmit} className="mb-4">
        {imagePreview ? (
          <div className="relative mt-2 w-[20rem] h-[20rem]">
            <Image
              src={imagePreview}
              alt="Selected Image"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
            <IoCloseCircle
              className="absolute top-2 right-2 cursor-pointer text-red-500"
              size={40}
              onClick={deleteImage}
            />
          </div>
        ) : (
          <input
            type="file"
            name="file"
            onChange={handleChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        )}
        <input
          type="submit"
          value="Upload"
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
        />
      </form>
    </main>
  );
}
