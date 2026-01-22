import { GreyhoundIcon } from "@/components/icons/GreyhoundIcon";
import { HarnessIcon } from "@/components/icons/HarnessIcon";
import { HorseIcon } from "@/components/icons/HorseIcon";
import { type RaceCategory } from "@/lib/types";

export const API_URL = "/api/races";
export const RACE_EXPIRATION_SECONDS = 60;
export const RACES_TO_SHOW = 5;
export const MIN_RACES_PER_CATEGORY = 5;
export const MS_PER_SECOND = 1000; // used to convert to UNIX
export const SECONDS_PER_MINUTE = 60;

export const RACE_CATEGORIES: RaceCategory[] = [
  {
    id: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
    name: "Greyhound",
    icon: GreyhoundIcon,
  },
  {
    id: "161d9be2-e909-4326-8c2c-35ed71fb460b",
    name: "Harness",
    icon: HarnessIcon,
  },
  {
    id: "4a2788f8-e825-4d36-9894-efd4baf1cfae",
    name: "Horse",
    icon: HorseIcon,
  },
];
