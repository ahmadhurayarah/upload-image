"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Blog } from "@/types";

interface BlogContextType {
  blogs: Blog[];
  addBlog: (blog: Blog) => void;
  updateBlog: (blog: Blog) => void;
  deleteBlog: (blogId: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await axiosInstance.get<Blog[]>("/api/blog");
      setBlogs(response.data);
    };

    fetchBlogs();
  }, []);

  const addBlog = (blog: Blog) => setBlogs((prev) => [...prev, blog]);

  const updateBlog = (updatedBlog: Blog) => {
    setBlogs((prev) =>
      prev.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
  };

  const deleteBlog = async (blogId: string) => {
    try {
      await axiosInstance.delete(`/api/blog/${blogId}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog, updateBlog, deleteBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogs must be used within a BlogProvider");
  }
  return context;
};
