"use client";

import { RACE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
}

const CategoryFilter = ({ selectedCategories, onCategoryToggle }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 pb-4">
      {RACE_CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategories.includes(category.id) ? "default" : "outline"}
          size="lg"
          onClick={() => onCategoryToggle(category.id)}
          className="flex-grow sm:flex-grow-0 transition-all duration-200 transform hover:scale-105"
          aria-pressed={selectedCategories.includes(category.id)}
        >
          <category.icon className="mr-2 h-2 w-2" />
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
