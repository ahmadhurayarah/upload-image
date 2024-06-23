"use client";

import { useState } from "react";
import { useBlogs } from "@/app/contexts/BlogContext"; // Adjusted import path
import Link from "next/link";
import Navbar from "../components/Navbar";
import Image from "next/image";
import BlogActions from "./components/BlogActions";
import { Blog } from "@/types"; // Adjusted import path

const sortOptions = {
  title_asc: "Title (A-Z)",
  title_desc: "Title (Z-A)",
  createdAt_asc: "Created At (Oldest)",
  createdAt_desc: "Created At (Newest)",
  updatedAt_asc: "Updated At (Oldest)",
  updatedAt_desc: "Updated At (Newest)",
};

export default function BlogList() {
  const { blogs } = useBlogs();
  const [sortOption, setSortOption] = useState<string>("createdAt_desc");

  const sortBlogs = (blogs: Blog[], sortOption: string) => {
    const [sortBy, sortOrder] = sortOption.split("_");
    let sortedBlogs = [...blogs];

    sortedBlogs.sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      const dateA = new Date(a[sortBy as keyof Blog]);
      const dateB = new Date(b[sortBy as keyof Blog]);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    return sortedBlogs;
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const sortedBlogs = sortBlogs(blogs, sortOption);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <Link href="/blog/create">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2 md:mb-0">
              Create New Blog
            </button>
          </Link>
          <div>
            <label htmlFor="sort" className="mr-2 text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 table-fixed">
            <thead>
              <tr>
                <th className="w-1/6 py-2 px-4 border-b">Title</th>
                <th className="w-1/3 py-2 px-4 border-b">Description</th>
                <th className="w-1/6 py-2 px-4 border-b">Image</th>
                <th className="w-1/6 py-2 px-4 border-b">Tags</th>
                <th className="w-1/6 py-2 px-4 border-b">Created At</th>
                <th className="w-1/6 py-2 px-4 border-b">Updated At</th>
                <th className="w-1/6 py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="py-2 px-4 border-b truncate">{blog.title}</td>
                  <td className="py-2 px-4 border-b truncate">
                    {blog.description}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={80}
                      height={80}
                      priority
                      className="object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b truncate">{blog.tags}</td>
                  <td className="py-2 px-4 border-b truncate">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b truncate">
                    {new Date(blog.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <BlogActions blogId={blog.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="block lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white p-4 mb-4 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
              <p className="mb-2">{blog.description}</p>
              <div className="mb-2 w-[15rem] h-[15rem] relative">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  layout="fill"
                  objectFit="contain"
                  priority
                  className="rounded-md"
                />
              </div>
              <p className="mb-2 text-gray-600">Tags: {blog.tags}</p>
              <p className="mb-2 text-gray-600">
                Created At: {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-2 text-gray-600">
                Updated At: {new Date(blog.updatedAt).toLocaleDateString()}
              </p>
              <BlogActions blogId={blog.id} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
