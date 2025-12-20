"use client";

import { useState } from "react";

interface Spec {
  key: string;
  value: string;
}

import FileUpload from "@/components/FileUpload";

import { useProductStore } from "@/hooks/product";

export default function CreateProductPage() {
  const { createProduct } = useProductStore();
  const { mutateAsync: createProductMutation, isPending: isCreating } =
    createProduct();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
  });

  const [files, setFiles] = useState<File[]>([]);

  const [specs, setSpecs] = useState<Spec[]>([{ key: "", value: "" }]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    if (specs.length > 1) {
      setSpecs(specs.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Filter out empty specs
    const validSpecs = specs.filter(
      (s) => s.key.trim() !== "" && s.value.trim() !== ""
    );
    const specsArray = validSpecs.map((spec) => ({ [spec.key]: spec.value }));

    try {
      await createProductMutation({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        brand: formData.brand,
        specs: specsArray,
        images: files,
      });

      setMessage({ type: "success", text: "Product created successfully!" });
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        brand: "",
      });
      setSpecs([{ key: "", value: "" }]);
      setFiles([]);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to create product." });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pt-24 pb-20">
      <div className="container-lux max-w-4xl mx-auto px-6">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide mb-4">
            Curate New Masterpiece
          </h1>
          <p className="text-muted text-sm tracking-widest uppercase">
            Admin Dashboard / Create Product
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
          {message && (
            <div
              className={`p-4 text-sm tracking-wide border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Basic Info Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-serif border-b border-border pb-2 mb-6">
              Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-xs uppercase tracking-widest text-muted"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border-b border-border py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-black/20"
                  placeholder="e.g. Rolex Submariner"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="brand"
                  className="text-xs uppercase tracking-widest text-muted"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full border-b border-border py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-black/20"
                  placeholder="e.g. Rolex"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-xs uppercase tracking-widest text-muted"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border-b border-border py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-black/20"
                placeholder="e.g. Watches"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-xs uppercase tracking-widest text-muted"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-border p-4 text-base focus:outline-none focus:border-black transition-colors bg-transparent min-h-[150px] resize-y"
                placeholder="Describe the provenance and details of the item..."
                required
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <FileUpload
                multiple={true} // Allow multiple images
                onFilesSelected={(selectedFiles) => {
                  // Update main state (appending new files)
                  // Note: In a real app we'd probably upload these to Cloudinary immediately
                  // or wait for submit. For now we just store the file objects.
                  // JavaScript File objects are not directly JSON serializable,
                  // so we'd handle that in submit.
                  // For this mock, we aren't changing the 'imageUrl' string field directly here
                  // but ideally we would store `files: File[]`.
                  setFiles((prev) => [...prev, ...selectedFiles]);
                }}
                label="Product Images"
                subLabel="Drag & Drop high-res product shots"
                currentFiles={files} // Pass current files to display/manage
                onRemoveFile={(fileToRemove) => {
                  setFiles((prev) =>
                    prev.filter((file) => file !== fileToRemove)
                  );
                }}
              />
              <p className="text-[10px] text-muted">
                First image will be used as the cover.
              </p>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="space-y-6 pt-8">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-6">
              <h2 className="text-lg font-serif">Specifications</h2>
              <button
                type="button"
                onClick={addSpec}
                className="text-xs uppercase tracking-widest hover:text-muted transition-colors"
              >
                + Add Spec
              </button>
            </div>

            <div className="space-y-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Key (e.g. Brand)"
                      value={spec.key}
                      onChange={(e) =>
                        handleSpecChange(index, "key", e.target.value)
                      }
                      className="w-full border-b border-border py-1 text-sm focus:outline-none focus:border-black bg-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Value (e.g. Patek Philippe)"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecChange(index, "value", e.target.value)
                      }
                      className="w-full border-b border-border py-1 text-sm focus:outline-none focus:border-black bg-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className={`text-muted hover:text-red-500 transition-colors pt-2 ${
                      specs.length === 1
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                    }`}
                    aria-label="Remove specification"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-12 text-right">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-black text-white px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Processing..." : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
