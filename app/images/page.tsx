"use client";

import React, { useEffect, useState } from "react";
import { listImages } from "../actions/listImages"; // Import the listImages function

export default function ImageGallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageKeys = await listImages();
        setImages(imageKeys);
      } catch (error) {
        console.error("Failed to fetch images", error);
      }
    };

    fetchImages();
  }, []);

  const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Image Gallery</h1>
      <div className="grid grid-cols-3 gap-4">
        {images.map((key) => (
          <div key={key} className="border p-2">
            <img
              src={`https://wizxaibucket.s3.amazonaws.com/${key}`}
              alt={key}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
