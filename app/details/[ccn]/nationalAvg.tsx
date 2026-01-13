import CategoryCard from "@/components/cards/category-card";
import { EnrichedProviderData } from "@/lib/types";

export default function NationalAvg({ data }: { data: EnrichedProviderData }) {
  return (
    <div className="">

      {/* Quality Measures Section */}
      <section className="bg-background text-foreground mt-2">
        {data.measures.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <CategoryCard title="Family/Caregiver Experience" measures={
              data.measures.filter((measure) => measure.family_caregiver_experience)
            } compare="nationalAverage" />
            <CategoryCard title="Quality of patient care" measures={
              data.measures.filter((measure) => measure.quality_patient_care)
            } compare="nationalAverage" />
            <CategoryCard title="All Data That Isn't Organized Yet" measures={
              data.measures.filter((measure) =>
                !measure.measureCode.includes("DENOMINATOR") &&
                !measure.conditions_treated &&
                !measure.location_of_care &&
                !measure.details_section &&
                !measure.family_caregiver_experience &&
                !measure.quality_patient_care
              )
            } compare="nationalAverage" />
          </div>
        ) : (
          <p className="text-sm text-foreground-alt italic">No quality measures available</p>
        )}
      </section>
    </div>
  )
}
