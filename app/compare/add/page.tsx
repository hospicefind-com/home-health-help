import { Suspense } from "react";
import HomeClient from "@/app/home-client";
import { GetCodeDetails } from "@/lib/hospice-data/get-code-details";
import { Code } from "@/lib/types";

type PageProps = {
  searchParams?: Promise<{
    search?: string;
    sort?: string;
  }>;
};

export default async function AddComparePage({ searchParams }: PageProps) {
  const initialSearch = (await searchParams)?.search ?? "";
  const initialSort = (await searchParams)?.sort ?? "";

  let initialScoreData: Code | undefined = undefined;
  if (initialSort) {
    const codes = await GetCodeDetails("opt_sorting");
    initialScoreData = codes.find((c) => c.measure_code === initialSort);
  }

  return (
    <Suspense fallback={null}>
      <HomeClient
        initialSearch={initialSearch}
        initialSort={initialSort}
        initialScoreData={initialScoreData}
        forComparePage={true}
      />
    </Suspense>
  );
}
