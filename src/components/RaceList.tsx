import { type RaceSummary } from "@/lib/types";
import RaceCard from "./RaceCard";
import { useState, useEffect } from "react";

interface RaceListProps {
  races: RaceSummary[];
}

const RaceList = ({ races }: RaceListProps) => {
  const [now, setNow] = useState(Date.now());
  const racesToShow = races.slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (racesToShow.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-card/50 p-12 text-center text-muted-foreground">
        <p className="text-lg font-medium">No Races Found</p>
        <p className="mt-1 text-sm">No upcoming races match the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {racesToShow.map((race) => (
        <div key={race.race_id} className="animate-fadeInUp">
          <RaceCard race={race} now={now} />
        </div>
      ))}
    </div>
  );
};

export default RaceList;
