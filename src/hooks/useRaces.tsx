"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { type RaceSummary, type NedsAPIResponse } from "@/lib/types";
import {
  API_URL,
  RACE_EXPIRATION_SECONDS,
  RACES_TO_SHOW,
  MIN_RACES_PER_CATEGORY,
  MS_PER_SECOND,
} from "@/lib/constants";

export function useRaces(selectedCategories: string[]) {
  const [allRaces, setAllRaces] = useState<RaceSummary[]>([]);
  const [upcoming, setUpcoming] = useState<RaceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nowSec, setNowSec] = useState(() => Date.now() / MS_PER_SECOND);
  const [expiryTick, setExpiryTick] = useState(0); // increments when a race drops off

  const inFlight = useRef(false);
  const firstLoad = useRef(true);
  const prevUpcomingLen = useRef<number | null>(null);
  const prevShort = useRef(false);
  const lastExpiry = useRef(0);

  useEffect(() => {
    const id = setInterval(() => setNowSec(Date.now() / MS_PER_SECOND), MS_PER_SECOND);
    return () => clearInterval(id);
  }, []);

  // find expired race and update upcoming list
  useEffect(() => {
    const cutoff = nowSec - RACE_EXPIRATION_SECONDS;
    const filtered = allRaces.filter((r) => r.advertised_start.seconds > cutoff);

    const previous = prevUpcomingLen.current ?? filtered.length;
    if (filtered.length < previous) {
      setExpiryTick((tick) => tick + 1);
    }

    prevUpcomingLen.current = filtered.length;
    setUpcoming(filtered);
  }, [allRaces, nowSec]);

  // trigger refetch when categories are under 5 and filtering is enabled
  const shortage = useMemo(() => {
    if (selectedCategories.length === 0) return upcoming.length < RACES_TO_SHOW;

    const counts = upcoming.reduce<Record<string, number>>((acc, r) => {
      acc[r.category_id] = (acc[r.category_id] || 0) + 1;
      return acc;
    }, {});

    return selectedCategories.some((cat) => (counts[cat] || 0) < MIN_RACES_PER_CATEGORY);
  }, [upcoming, selectedCategories]);

  const fetchRaces = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (firstLoad.current) setIsLoading(true);

    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`API request failed with status: ${res.status}`);

      const json: NedsAPIResponse = await res.json();
      if (json.status !== 200 || !json.data?.race_summaries)
        throw new Error("Invalid API response structure");

      const list: RaceSummary[] = json.data.next_to_go_ids
        .map((id) => json.data!.race_summaries[id])
        .filter(Boolean);

      setAllRaces(list);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
      inFlight.current = false;
      firstLoad.current = false;
    }
  }, []);

  useEffect(() => {
    const shouldInitial = firstLoad.current;
    const becameShort = shortage && !prevShort.current;
    const dueToExpiry = expiryTick > lastExpiry.current;

    if (shouldInitial || becameShort || dueToExpiry) fetchRaces();

    prevShort.current = shortage;
    lastExpiry.current = expiryTick;
    firstLoad.current = false;
  }, [expiryTick, shortage, fetchRaces]);

  const races = useMemo(() => {
    const pool = selectedCategories.length
      ? upcoming.filter((r) => selectedCategories.includes(r.category_id))
      : upcoming;

    return pool
      .slice()
      .sort((a, b) => a.advertised_start.seconds - b.advertised_start.seconds)
      .slice(0, RACES_TO_SHOW);
  }, [upcoming, selectedCategories]);

  return { races, isLoading, error };
}
