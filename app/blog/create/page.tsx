"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/app/actions/blogUpload"; // Import the server action
import axiosInstance from "@/lib/axiosInstance";
import { IoCloseCircle } from "react-icons/io5";
import Image from "next/image";
import { useBlogs } from "@/app/contexts/BlogContext"; // Adjusted import path

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { addBlog } = useBlogs();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const deleteImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile); // Upload the image and get the URL
      }
      const response = await axiosInstance.post("/api/blog", {
        title,
        description,
        image: imageUrl,
        tags,
      });

      if (response.status === 200) {
        addBlog(response.data); // Add the new blog to the context
        router.push("/blog"); // Navigates to /blog after creation
      } else {
        setError("Failed to create blog");
      }
    } catch (error) {
      setError("Failed to create blog");
      console.error("Failed to create blog", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          {imagePreview ? (
            <div className="relative mt-2 w-[20rem] h-[20rem] sm:w-[15rem] sm:h-[15rem]">
              <Image
                src={imagePreview}
                alt="Selected Image"
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
              <IoCloseCircle
                className="absolute top-1 right-1 cursor-pointer text-red-500"
                size={40}
                onClick={deleteImage}
              />
            </div>
          ) : (
            <input
              type="file"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create
        </button>
      </form>
    </div>
  );
}
