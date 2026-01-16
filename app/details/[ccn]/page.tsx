import { getEnrichedProviderData } from "@/lib/hospice-data/get-enriched-provider-data";
import type { EnrichedProviderData } from "@/lib/types";
import Overview from "./overview";
import StateAvg from "./stateAvg";
import NationalAvg from "./nationalAvg";
import Dropdown from "./dropdown";
import GoogleReviews from "./reviews";
import { getPlaceId } from "@/lib/google/get-placeid";

interface DetailPageProps {
  params: Promise<{
    ccn: string;
  }>
  searchParams: Promise<{ view?: string }>;
}

export default async function DetailPage({ params, searchParams }: DetailPageProps) {
  const { ccn } = await params;
  const { view } = await searchParams;
  const data: EnrichedProviderData | null = await getEnrichedProviderData(ccn);
  const placeId = await getPlaceId(ccn);
  console.log(placeId);

  if (!data) {
    return <div className="container mx-auto max-w-4xl px-4 py-8">Failed to load provider data</div>;
  }

  const currentView = view || "Overview";

  return (
    <div className="max-w-screen-xl mx-auto px-2">

      {/* Provider Header */}
      <h1 className="text-6xl/9 font-dongle font-bold tracking-tight pt-4 bg-background">{data.facilityName}</h1>

      {/* Contact Information Section */}
      <section className="">
        <div className="space-y-1 text-sm mb-2">
          <p>{data.addressLine1}</p>
          {data.addressLine2 && <p>{data.addressLine2}</p>}
          <p>
            {data.city}, {data.state} {data.zipCode}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm">
            {data.phone}
          </p>
        </div>
      </section>

      <div className="sticky top-[65px]">
        <Dropdown reviews={placeId !== ""} />
      </div>

      {currentView === "Overview" && <Overview data={data} />}
      {currentView === "State Average" && <StateAvg data={data} />}
      {currentView === "National Average" && <NationalAvg data={data} />}
      {currentView === "Google Reviews" && placeId !== "" && <GoogleReviews placeID="placeId" />}

    </div >
  )
}
