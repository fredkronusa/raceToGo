"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { type RaceSummary, type NedsAPIResponse } from "@/lib/types";
import { API_URL } from "@/lib/constants";

const RACE_EXPIRATION_SECONDS = 60; // Remove race 60 seconds after start
const RACES_TO_SHOW = 10;
const MIN_RACES_PER_CATEGORY = 5;

export function useRaces(selectedCategories: string[]) {
  const [allRaces, setAllRaces] = useState<RaceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchRaces = useCallback(async () => {
    // Don't set loading to true on refetch
    if (allRaces.length === 0) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      const result: NedsAPIResponse = await response.json();

      if (result.status !== 200 || !result.data?.race_summaries) {
        throw new Error("Invalid API response structure");
      }

      const raceSummaries = result.data.next_to_go_ids
        .map((id) => result.data.race_summaries[id])
        .filter(Boolean);

      setAllRaces(raceSummaries);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch races:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [allRaces.length]);

  const shouldFetch = useMemo(() => {
    if (isLoading) return false;

    const nowInSeconds = Date.now() / 1000;
    const upcomingRaces = allRaces.filter(
      (race) => race.advertised_start.seconds > nowInSeconds - RACE_EXPIRATION_SECONDS
    );

    if (selectedCategories.length === 0) {
      return upcomingRaces.length < RACES_TO_SHOW;
    }

    for (const categoryId of selectedCategories) {
      const categoryRaceCount = upcomingRaces.filter((r) => r.category_id === categoryId).length;
      if (categoryRaceCount < MIN_RACES_PER_CATEGORY) {
        return true;
      }
    }

    return false;
  }, [allRaces, selectedCategories, isLoading]);

  useEffect(() => {
    if (allRaces.length === 0) {
      fetchRaces();
    }
  }, [fetchRaces, allRaces.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (shouldFetch) {
        fetchRaces();
      }
    }, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchRaces, shouldFetch]);

  const processedRaces = useMemo(() => {
    const nowInSeconds = currentTime;

    return allRaces
      .filter((race) => {
        // Keep race if it has not started or started less than RACE_EXPIRATION_SECONDS ago
        return race.advertised_start.seconds > nowInSeconds - RACE_EXPIRATION_SECONDS;
      })
      .filter(
        (race) => selectedCategories.length === 0 || selectedCategories.includes(race.category_id)
      )
      .sort((a, b) => a.advertised_start.seconds - b.advertised_start.seconds)
      .slice(0, RACES_TO_SHOW);
  }, [allRaces, selectedCategories, currentTime]);

  return { races: processedRaces, isLoading, error };
}
