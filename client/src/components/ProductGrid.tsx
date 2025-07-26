import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  categoryId?: string;
  searchQuery?: string;
  viewMode: "grid" | "list";
}

export default function ProductGrid({ categoryId, searchQuery, viewMode }: ProductGridProps) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products", { categoryId, search: searchQuery }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-tg-card rounded-xl shadow-tg overflow-hidden animate-pulse">
              <div className="w-full h-32 bg-gray-200"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-tg-text-light">No products found</p>
      </div>
    );
  }

  return (
    <main className="px-4 py-4 pb-20">
      <div className="grid grid-cols-2 gap-4">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
