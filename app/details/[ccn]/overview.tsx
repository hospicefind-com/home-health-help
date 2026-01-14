import CategoryCard from "@/components/cards/category-card";
import { EnrichedProviderData, EnrichedProviderMeasure } from "@/lib/types";
import { sortByScoreGeneric } from "@/lib/sortby-functions/sortby-functions";

// Helper function to sort measures by score, using the generic sorting function
function sortByScore(a: EnrichedProviderMeasure, b: EnrichedProviderMeasure): number {
  return sortByScoreGeneric(a, b, (measure) => measure.score);
}

export default function Overview({ data }: { data: EnrichedProviderData }) {
  return (
    <div className="">

      {/* Quality Measures Section */}
      <section className="bg-background text-foreground mt-2">
        {data.measures.length > 0 ? (
          <div className="grid bg-foreground gap-[1px] md:grid-cols-2">
            <CategoryCard title="Conditions treated" measures={
              data.measures
                .filter((measure) => measure.conditions_treated)
                .sort(sortByScore)
            } />
            <CategoryCard title="Location of care" measures={
              data.measures
                .filter((measure) => measure.location_of_care)
                .sort(sortByScore)
            } />
            <CategoryCard title="Details" measures={
              data.measures.filter((measure) => measure.details_section)
            } />
            <CategoryCard title="Family/Caregiver Experience" measures={
              data.measures.filter((measure) => measure.family_caregiver_experience)
            } />
            <CategoryCard title="Quality of patient care" measures={
              data.measures.filter((measure) => measure.quality_patient_care)
            } />
            <CategoryCard title="All Data That Isn't Organized Yet" measures={
              data.measures.filter((measure) =>
                !measure.measureCode.includes("DENOMINATOR") &&
                !measure.conditions_treated &&
                !measure.location_of_care &&
                !measure.details_section &&
                !measure.family_caregiver_experience &&
                !measure.quality_patient_care
              )
            } />
          </div>
        ) : (
          <p className="text-sm text-foreground-alt italic">No quality measures available</p>
        )}
      </section>
    </div>
  )
}
