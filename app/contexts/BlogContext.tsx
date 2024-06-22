"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Blog } from "@/types";

interface BlogContextType {
  blogs: Blog[];
  fetchBlogs: () => void;
  deleteBlog: (blogId: string) => void;
  addBlog: (newBlog: Blog) => void; // New function for adding a blog
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogs must be used within a BlogProvider");
  }
  return context;
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get<Blog[]>("/api/blog");
      setBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  const deleteBlog = async (blogId: string) => {
    try {
      await axiosInstance.delete(`/api/blog/${blogId}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
  };

  const addBlog = (newBlog: Blog) => {
    setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, fetchBlogs, deleteBlog, addBlog }}>
      {children}
    </BlogContext.Provider>
  );
};
