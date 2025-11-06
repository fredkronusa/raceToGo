import { type RaceSummary } from "@/lib/types";
import RaceCard from "./RaceCard";
import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence initial={false}>
        {racesToShow.map((race) => (
          <motion.div
            key={race.race_id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <RaceCard race={race} now={now} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RaceList;
