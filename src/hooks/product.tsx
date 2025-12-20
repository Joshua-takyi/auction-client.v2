import useApiStore from "@/store/apistore";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export interface Product {
  title: string;
  category: string;
  description: string;
  brand: string;
  specs: Record<string, any>[];
  images: File[];
}

export const useProductStore = () => {
  const { api } = useApiStore();
  const queryClient = new QueryClient();

  const createProduct = () => {
    return useMutation({
      mutationKey: ["product"],
      mutationFn: async (product: Product) => {
        const formData = new FormData();

        const productData = {
          title: product.title,
          category: product.category,
          description: product.description,
          brand: product.brand,
          specs: product.specs,
        };

        formData.append("data", JSON.stringify(productData));

        if (product.images && product.images.length > 0) {
          product.images.forEach((file) => {
            formData.append("images", file);
          });
        }

        const res = await api.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status != 201) {
          throw new Error("Failed to create product");
        }
        console.log(res.data);
        return res.data;
      },
      onSuccess(): void {
        queryClient.invalidateQueries({ queryKey: ["product"] });
      },
    });
  };

  // const listProducts = (limit: number = 10, offset: number = 0) => {
  //   return useQuery<Product[]>({
  //     queryKey: ["products", limit, offset],
  //     queryFn: async () => {
  //       const res = await api.get("/products", {
  //         params: {
  //           limit,
  //           offset,
  //         },
  //       });
  //       if (res.status != 200) {
  //         throw new Error("Failed to fetch products");
  //       }
  //       console.log(res.data);
  //       return res.data || [];
  //     },
  //     onSuccess(): void {
  //       queryClient.invalidateQueries({ queryKey: ["product"] });
  //     },
  //   });
  // };

  const useUserProducts = () => {
    return useQuery({
      queryKey: ["products", "user"],
      queryFn: async () => {
        const res = await api.get("/products/user");
        if (res.status !== 200) {
          throw new Error("Failed to fetch user products");
        }
        return res.data.data;
      },
    });
  };

  return {
    createProduct,
    useUserProducts,
  };
};
