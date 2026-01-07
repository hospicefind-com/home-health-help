import { getEnrichedProviderData } from "@/lib/hospice-data/get-enriched-provider-data";
import type { EnrichedProviderData } from "@/lib/types";
import Overview from "./overview";
import StateAvg from "./stateAvg";
import NationalAvg from "./nationalAvg";
import Dropdown from "./dropdown";

interface DetailPageProps {
  params: Promise<{
    ccn: string;
  }>
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { ccn } = await params;
  const data: EnrichedProviderData | null = await getEnrichedProviderData(ccn);

  if (!data) {
    return <div className="container mx-auto max-w-4xl px-4 py-8">Failed to load provider data</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-2 pt-4">

      {/* Provider Header */}
      <h1 className="text-6xl/9 font-dongle font-bold tracking-tight">{data.facilityName}</h1>

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

      <Dropdown />

    </div >
  )
}
