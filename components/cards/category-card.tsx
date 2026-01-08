import { EnrichedProviderMeasure } from "@/lib/types";
import Statistic from "../display-data/statistic";

interface CategoryCardProps {
  title: string,
  measures: EnrichedProviderMeasure[],
  compare?: "stateAverage" | "nationalAverage"
}

export default function CategoryCard({ title, measures, compare }: CategoryCardProps) {
  return (
    <div className="bg-background text-forground">
      <h1 className="font-bold text-lg">{title}</h1>
      {measures.map((measure, index) => (
        <article
          key={index}
          className="mb-2"
        >
          <Statistic measure={measure} compare={compare} />
        </article>
      ))}
    </div>
  )
}
