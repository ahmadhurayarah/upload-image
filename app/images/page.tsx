"use client";

import React, { useEffect, useState } from "react";
import { listImages, deleteImage } from "../actions/s3Actions";
import Navbar from "../components/Navbar";
import { IoCloseCircle } from "react-icons/io5";
import Image from "next/image";

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

  return (
    <>
      <div>
        <main className="container mx-auto p-4">
          <h1 className="text-3xl mb-4">Image Gallery</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((key) => (
              <div key={key} className="relative border p-2">
                <div className="relative w-full h-[20rem] mb-4">
                  <Image
                    src={`https://wizxaibucket.s3.us-east-1.amazonaws.com/${key}`}
                    alt={key}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    style={{ objectFit: "contain" }}
                  />
                  <button
                    onClick={() => handleDelete(key)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <IoCloseCircle size={25} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
