import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type RaceSummary } from '@/lib/types';
import CountdownTimer from './CountdownTimer';
import { RACE_CATEGORIES } from '@/lib/constants';

interface RaceCardProps {
  race: RaceSummary;
}

const RaceCard = ({ race }: RaceCardProps) => {
  const category = RACE_CATEGORIES.find(c => c.id === race.category_id);

  return (
    <Card className="w-full transition-shadow duration-300 hover:shadow-lg border-l-4 border-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-primary truncate">
          {race.meeting_name}
        </CardTitle>
        {category && (
          <div className="flex items-center text-muted-foreground" title={category.name}>
             <category.icon className="h-6 w-6" aria-label={category.name} />
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm font-medium text-muted-foreground">Race {race.race_number}</p>
            <CountdownTimer startTime={race.advertised_start.seconds} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RaceCard;
