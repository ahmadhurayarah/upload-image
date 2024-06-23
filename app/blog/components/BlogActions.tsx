"use client";

import Link from "next/link";
import { useBlogs } from "@/app/contexts/BlogContext"; // Adjusted import path

interface BlogActionsProps {
  blogId: string;
}

const BlogActions: React.FC<BlogActionsProps> = ({ blogId }) => {
  const { deleteBlog } = useBlogs();

  const handleDelete = async () => {
    await deleteBlog(blogId);
  };

  return (
    <div>
      <Link href={`/blog/view/${blogId}`}>
        <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">
          View
        </button>
      </Link>

      <Link href={`/blog/edit/${blogId}`}>
        <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
          Edit
        </button>
      </Link>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default BlogActions;
