"use client";

import { useMemo, useState } from "react";
import { useRaces } from "@/hooks/useRaces";
import CategoryFilter from "@/components/CategoryFilter";
import RaceList from "@/components/RaceList";

import Header from "@/components/Header";
import { Spinner } from "@/components/ui/spinner";
import { RACE_CATEGORIES } from "@/lib/constants";
import { Card } from "@/components/ui/card";

export default function Home() {
  const initialSelectedCategories = useMemo(() => RACE_CATEGORIES.map((c) => c.id), []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories);

  const { races, isLoading, error } = useRaces(selectedCategories);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      // Ensure at least one category is always selected or reset to initial state
      return next.length > 0 ? next : initialSelectedCategories;
    });
  };

  if (isLoading && races.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header>
        <Header />
      </header>
      <main>
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-headline tracking-tight">
              Next to go race
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Your real-time guide to the next races to go.
            </p>
          </header>

          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
          />

          {error && (
            <Card className="text-center p-4 font-headline text-destructive">
              There was a problem fetching the latest race data. Please check your connection or try
              again later.
            </Card>
          )}

          <RaceList races={races} />
        </div>
      </main>
    </div>
  );
}
