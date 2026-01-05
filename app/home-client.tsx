"use client"

import SearchBar from "@/components/base-ui/search-bar";
import HospiceCards from "@/components/cards/hospice-display-cards";
import SortDropdown from "@/components/base-ui/sort-by-options";
import { Code } from "@/lib/types";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  initialSearch: string;
  initialSort: string;
  initialScoreData?: Code;
  forComparePage?: boolean;
};

export default function HomeClient({ initialSearch, initialSort, initialScoreData, forComparePage = false }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [measureCode, setMeasureCode] = useState(initialSort || "");
  const [scoreData, setScoreData] = useState<Code | undefined>(initialScoreData);
  const [isLoading, setIsLoading] = useState(false);

  // Keep sort in sync if URL changes due to navigation (back/forward)
  useEffect(() => {
    const spSort = searchParams.get("sort") || "";
    if (spSort !== measureCode) setMeasureCode(spSort);
    // We intentionally do NOT sync search text from URL while typing to avoid rubber-banding.
  }, [searchParams, measureCode]);

  const handleSearchChange = (newSearchQuery: string) => {
    // Update local state immediately; URL will update via debounce below
    setSearchQuery(newSearchQuery);
  };

  // Debounce URL updates for search to prevent input focus jitter
  useEffect(() => {
    const spSearch = searchParams.get("search") || "";
    // If URL already matches our local state, do nothing
    if (spSearch === searchQuery) return;

    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery, searchParams, pathname, router]);

  const handleSortChange = (newSortValue: string, newCode: Code) => {
    setMeasureCode(newSortValue);
    setScoreData(newCode);

    const params = new URLSearchParams(searchParams);
    if (newSortValue) {
      params.set("sort", newSortValue);
    } else {
      params.delete("sort");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background max-w-6xl mx-auto px-2 pt-2">
      <h1 className="text-6xl/9 font-dongle font-bold text-foreground">Search Hospices By Zipcode They Serve</h1>
      <p className="text-foreground mb-4">You can compare up to 5 hospices.</p>
      <div className="flex justify-center max-w-full gap-3 sm:flex-row flex-col">
        <SearchBar value={searchQuery} onSearchChange={handleSearchChange} />
        <SortDropdown selectedValue={measureCode} onSortChange={handleSortChange} loading={isLoading} />
      </div>
      <HospiceCards
        page={0}
        zip={searchQuery}
        measureCode={measureCode}
        scoreData={scoreData}
        onLoadingChange={setIsLoading}
        forComparePage={forComparePage}
      />
    </div>
  );
}
