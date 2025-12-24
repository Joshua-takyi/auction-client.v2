"use client";

import { useState } from "react";

interface Spec {
  key: string;
  value: string;
}

import FileUpload from "@/components/FileUpload";

import { useProductStore } from "@/hooks/product";
import CreateProduct from "@/components/createProduct";

export default function CreateProductPage() {
  return (
    <div>
      <CreateProduct />
    </div>
  );
}
