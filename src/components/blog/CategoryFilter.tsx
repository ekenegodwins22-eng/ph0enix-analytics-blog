import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={
            activeCategory === category
              ? "bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
              : "border-border hover:border-primary/50 hover:text-primary transition-all duration-300"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
