export interface AdvertisedStart {
  seconds: number;
}

export interface RaceSummary {
  race_id: string;
  race_name: string;
  race_number: number;
  meeting_name: string;
  category_id: string;
  advertised_start: AdvertisedStart;
}

export interface RaceData {
  next_to_go_ids: string[];
  race_summaries: Record<string, RaceSummary>;
}

export interface NedsAPIResponse {
  status: number;
  data: RaceData;
  message: string;
}

export interface RaceCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}
