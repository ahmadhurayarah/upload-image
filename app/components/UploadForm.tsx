"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import { Upload } from "../actions/Upload";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    const response = await fetch("/api/images");
    if (response.ok) {
      const imageList = await response.json();
      const sortedImages = imageList.sort((a: string, b: string) =>
        b.localeCompare(a)
      );
      setImages(sortedImages);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      data.append("file", file);
      await Upload(data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchImages();
    }
  };

  return (
    <main className="mt-10 flex items-center justify-center ">
      <div>
        <h1>Uploaded An Image</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            ref={fileInputRef}
          />

          <button
            className="px-[1rem] rounded-sm border-[1px] hover:text-lg border-gray-500 hover:border-green-600 hover:text-green-600 transition transition-color"
            type="submit"
            value="Upload"
          >
            Upload
          </button>
        </form>
        <div>
          <h2>Uploaded Images</h2>
          <ul>
            {images.map((image, index) => (
              <li key={index}>
                <img
                  src={`/uploads/${image}`}
                  alt={`Uploaded ${image}`}
                  style={{ maxWidth: "200px" }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
