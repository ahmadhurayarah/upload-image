"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { uploadImage } from "@/app/actions/blogUpload"; // Import the server action
import axiosInstance from "@/lib/axiosInstance";
import { IoCloseCircle } from "react-icons/io5";
import Image from "next/image";
import { useBlogs } from "@/app/contexts/BlogContext";

export default function EditBlog() {
  const router = useRouter();
  const { blogId } = useParams();
  const { updateBlog } = useBlogs();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/api/blog/${blogId}`);
        const { title, description, image, tags } = response.data;
        setTitle(title);
        setDescription(description);
        setImagePreview(image);
        setTags(tags);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch blog", error);
        setError("Failed to fetch blog details.");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

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
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile); // Upload the new image and get the URL
      }

      const response = await axiosInstance.patch(`/api/blog/${blogId}`, {
        title,
        description,
        image: imageUrl,
        tags,
      });

      if (response.status === 200) {
        updateBlog(response.data); // Update the blog in the context
        router.push("/blog"); // Navigates to /blog after update
      } else {
        setError("Failed to update blog");
      }
    } catch (error) {
      setError("Failed to update blog");
      console.error("Failed to update blog", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
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
          {imagePreview && (
            <div className="relative mt-2 w-[20rem] h-[20rem]">
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
          )}
          {!imagePreview && (
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
          Update
        </button>
      </form>
    </div>
  );
}
