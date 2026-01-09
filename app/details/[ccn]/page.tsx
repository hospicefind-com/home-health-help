import { getEnrichedProviderData } from "@/lib/hospice-data/get-enriched-provider-data";
import type { EnrichedProviderData } from "@/lib/types";
import Overview from "./overview";
import StateAvg from "./stateAvg";
import NationalAvg from "./nationalAvg";
import { Tabs } from "@base-ui-components/react";

interface DetailPageProps {
  params: Promise<{
    ccn: string;
  }>
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { ccn } = await params;
  const data: EnrichedProviderData | null = await getEnrichedProviderData(ccn);
  // console.log(data);

  if (!data) {
    return <div className="container mx-auto max-w-4xl px-4 py-8">Failed to load provider data</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">

      {/* Provider Header */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{data.facilityName}</h1>
      </header>

      {/* Contact Information Section */}
      <section className="rounded-lg border border-foreground-alt bg-background text-foreground p-6">
        <div className="space-y-1 text-sm mb-2">
          <p>{data.addressLine1}</p>
          {data.addressLine2 && <p>{data.addressLine2}</p>}
          <p>
            {data.city}, {data.state} {data.zipCode}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-foreground-alt">Phone:</span> {data.phone}
          </p>
        </div>
      </section>

      <Tabs.Root className="w-full mx-auto py-4" defaultValue="overview">
        <Tabs.List className="sticky top-[65px] flex items-center bg-background-alt text-foreground z-0 p-1 h-[40px] rounded-full">
          <Tabs.Tab
            className="flex-1 z-[2] h-full"
            value="overview"
          >
            Overview
          </Tabs.Tab>
          <Tabs.Tab
            className="flex-1 z-[2] h-full"
            value="stateAvg"
          >
            State Avg
          </Tabs.Tab>
          <Tabs.Tab
            className="flex-1 z-[2] h-full"
            value="nationalAvg"
          >
            National Avg
          </Tabs.Tab>
          {/* <Tabs.Tab */}
          {/*   className="flex-1 z-[2] h-full" */}
          {/*   value="reviews" */}
          {/* > */}
          {/*   Reviews */}
          {/* </Tabs.Tab> */}
          <Tabs.Indicator className="rounded-full z-[1] absolute left-[var(--active-tab-left)] bg-background w-[var(--active-tab-width)] h-[var(--active-tab-height)] transition-all" />
        </Tabs.List>
        <Tabs.Panel value="overview">
          <Overview data={data} />
        </Tabs.Panel>
        <Tabs.Panel value="stateAvg">
          <StateAvg data={data} />
        </Tabs.Panel>
        <Tabs.Panel value="nationalAvg">
          <NationalAvg data={data} />
        </Tabs.Panel>
        {/* <Tabs.Panel value="reviews"> */}
        {/*   <GoogleReviews placeID={"ChIJUyIunYKJUocRQZhPC0nfFFk"} /> */}
        {/* </Tabs.Panel> */}
      </Tabs.Root>
    </div>
  )
}
