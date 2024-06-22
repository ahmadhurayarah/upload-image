"use client";

import React, { useEffect, useState } from "react";
import { listImages, deleteImage } from "../actions/s3Actions"; // Import the deleteImage function
import Navbar from "../components/Navbar";

export default function ImageGallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageKeys: (string | undefined)[] = await listImages();
        const validImageKeys: string[] = imageKeys.filter(
          (key): key is string => key !== undefined
        );
        setImages(validImageKeys);
      } catch (error) {
        console.error("Failed to fetch images", error);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (key: string) => {
    try {
      await deleteImage(key);
      setImages(images.filter((image) => image !== key));
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;

  return (
    <>
      <div>
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl mb-4">Image Gallery</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((key) => (
              <div key={key} className="border p-2 flex flex-col items-center">
                <img
                  src={`https://wizxaibucket.s3.amazonaws.com/${key}`}
                  alt={key}
                  className="w-full h-auto"
                />
                <button
                  onClick={() => handleDelete(key)}
                  className="mt-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
