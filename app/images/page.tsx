"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const ImagesPage = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/images");
        const imageList: string[] = response.data;
        setImages(imageList.sort((a: string, b: string) => b.localeCompare(a)));
      } catch (error) {
        console.error("Error fetching images", error);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (key: string) => {
    try {
      await axios.delete("/api/delete", { data: { key } });
      setImages(images.filter((image) => image !== key));
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Uploaded Images</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded opacity-100 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ImagesPage;
