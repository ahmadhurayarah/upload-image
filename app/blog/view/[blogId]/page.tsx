"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";

interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

const ViewBlog = () => {
  const { blogId } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/api/blog/${blogId}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Failed to fetch blog", error);
        setError("Failed to fetch blog details.");
      }
    };

    fetchBlog();
  }, [blogId]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <>
        <div className="container mx-auto p-4">
          <div>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center">{blog.title}</h1>
          <div className="relative w-full h-[40rem] mb-4">
            <Image
              src={blog.image}
              alt={blog.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="prose max-w-none mb-4">
            <p>Description: {blog.description}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tags: {blog.tags}</span>
            <span>
              Created At: {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <span>
              Updated At: {new Date(blog.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
