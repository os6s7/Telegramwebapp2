import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="bg-tg-card border-b border-gray-100">
      <div className="flex space-x-1 px-4 py-3 overflow-x-auto scrollbar-hide">
        <Button
          variant={selectedCategory === "" ? "default" : "secondary"}
          size="sm"
          onClick={() => onCategoryChange("")}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
            selectedCategory === "" 
              ? "bg-tg-blue text-white" 
              : "bg-tg-bg text-tg-text hover:bg-gray-200"
          }`}
        >
          All
        </Button>
        {categories.map((category: any) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "secondary"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
              selectedCategory === category.id 
                ? "bg-tg-blue text-white" 
                : "bg-tg-bg text-tg-text hover:bg-gray-200"
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
