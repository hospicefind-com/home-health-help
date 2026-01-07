"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CardData, Code } from "@/lib/types";
import { fetchHospiceData } from "@/lib/hospice-data/fetch-hospice-data";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/base-ui/button";
import { createToast } from "@/lib/toast";

type Props = {
  page: number;
  zip: string;
  measureCode: string;
  scoreData?: Code;
  onLoadingChange?: (loading: boolean) => void;
  forComparePage?: boolean;
}

export default function HospiceCards({ page, zip, measureCode, scoreData, onLoadingChange, forComparePage }: Props) {
  const [hospiceDisplayData, setHospiceDisplayData] = useState<CardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCCNs, setSelectedCCNs] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestIdRef = useRef(0);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const fetchHospices = async () => {
      const rid = ++requestIdRef.current;
      onLoadingChange?.(true);
      setIsLoading(true);
      try {
        // Call the server action to get the card data
        const result = await fetchHospiceData(zip, measureCode, scoreData);
        if (result.success) {
          setHospiceDisplayData(result.data);
          setError(null);
        } else {
          setError(result.error || "An error occurred while loading hospice details.");
        }
      } catch (err) {
        console.error("Failed to process hospice data:", err);
        setError("An error occurred while loading hospice details.");
      } finally {
        if (requestIdRef.current === rid) {
          onLoadingChange?.(false);
          setIsLoading(false);
        }
      }
    };

    if (zip) {
      fetchHospices();
    } else {
      // If zip cleared, ensure loading stops and data resets
      onLoadingChange?.(false);
      setHospiceDisplayData([]);
      setError(null);
      setIsLoading(false);
    }
  }, [page, zip, measureCode, scoreData, onLoadingChange]);

  // This toggles the selection for a specific card for a given ccn.
  // It adds that CCN to the already selected CCN list only if the list doesn't already have 5 elements.
  const toggleSelection = (ccn: string) => {
    setSelectedCCNs(prev => {
      if (prev.includes(ccn)) {
        // if we have everything unchecked that means we're done comparing
        // so if we're removing the last element that means it's empty now
        if (prev.length === 1) {
          setIsComparing(false);
        }
        return prev.filter(id => id !== ccn)
      }
      if (prev.length < 5) {
        return [...prev, ccn];
      }

      return prev;
    })
  }

  // Put the selected CCN's into a list
  const isSelected = (ccn: string) => selectedCCNs.includes(ccn);

  // This redirects to the compare endpoint with the CCN's listed in the search params
  const handleCompare = () => {
    const params = new URLSearchParams();
    selectedCCNs.forEach(ccn => params.append('ccn', ccn));
    router.push(`/compare?${params.toString()}`);
  };

  if (error) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-red-400">{error}</div>;
  }

  // need to figure out what the score's out of
  let outOfDisplay = "";
  let real_desc = "General Process Score"; // this corresponds to the default code in get-displaycard-data.ts
  // this checks if scoreData exists first because it doesn't upon first load
  if (scoreData) {
    // for updating the symbol to go next to the number
    if (scoreData.out_of !== "N/A" && scoreData.out_of !== "yes/no") {
      // if the 'out_of' parameter is a number that means the score is #/that-given number
      const isOutOfANum = !isNaN(Number(scoreData.out_of));
      if (isOutOfANum) {
        outOfDisplay = `/${scoreData.out_of}`;
      } else {
        outOfDisplay = scoreData.out_of;
      }
    }

    // for updating the description
    real_desc = scoreData.real_desc;
  }

  const handleClickComparePage = (ccn: string) => {
    if (forComparePage) {
      const params = new URLSearchParams(searchParams.toString());
      if (!params.toString().includes(ccn)) {
        params.append('ccn', ccn);
        router.push(`/compare?${params.toString()}`);
      }
      else {
        createToast("You're already comparing this hospice");
      }
    }
    else if (!isComparing) {
      router.push(`/details/${ccn}`)
    }
  }

  return (
    <div id="hospice-display-box" className="max-w-4xl p-2">
      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-background border border-foreground-alt rounded-lg p-6 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded bg-background-alt" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-2/3 bg-background-alt rounded" />
                  <div className="h-4 w-1/3 bg-background-alt rounded" />
                  <div className="h-4 w-1/4 bg-background-alt rounded" />
                  <div className="h-4 w-1/2 bg-background-alt rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : hospiceDisplayData.length === 0 && zip ? (
        <div className="text-center text-foreground-alt py-12">
          <p>No hospices found! Please check your zipcode to see if it&apos;s correct.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {hospiceDisplayData.map((facility) => {
            const ccn = facility?.general_data.cms_certification_number_ccn;
            const selected = isSelected(ccn);

            return (
              <div
                key={ccn}
                className={`relative bg-background border rounded-lg p-3 transition ${selected
                  ? 'border-accent ring-2 ring-accent'
                  : 'border-foreground-alt hover:bg-background-alt hover:ring-2 hover:ring-accent'
                  } ${isComparing ? 'cursor-pointer' : ''}`}
                onClick={isComparing ? () => toggleSelection(ccn) : undefined}
              >
                <h3 className="text-5xl/9 font-bold text-foreground mb-2 font-dongle">
                  {facility?.general_data.facility_name}
                </h3>
                <div className="flex flex-row flex-1 items-end" onClick={() => handleClickComparePage(ccn)}>
                  <div className="flex-1">
                    <p className="mb-2">
                      {facility?.general_data.ownership_type}
                    </p>
                    <p className="mb-2">
                      {facility?.general_data.telephone_number}
                    </p>
                    <p className="mb-2">
                      {real_desc}: {facility?.sortby_medicare_scores.score}{outOfDisplay}
                    </p>
                  </div>
                  <div>
                    {isComparing ? (
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelection(ccn)}
                        disabled={!selected && selectedCCNs.length >= 5}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 h-5 w-5 rounded border-foreground-alt cursor-pointer accent-accent"
                      />
                    ) : null}
                    {/* Compare trigger - themed and positioned top-right when not in comparison mode */}
                    {!isComparing && !forComparePage && (
                      <Button
                        size="lg"
                        className="bg-accent"
                        onClick={(e) => { e.stopPropagation(); setIsComparing(true); toggleSelection(ccn) }}
                      >
                        Compare
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Floating Compare Bar */}
      {selectedCCNs.length > 0 && (
        <div
          className="grid grid-cols-3 items-center fixed bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-primary-foreground rounded-full shadow-lg p-2 gap-4 z-50 w-full sm:w-max sm:max-w-[300px]"
        >
          <button
            onClick={() => { setSelectedCCNs([]); setIsComparing(false) }}
            className="text-background underline hover:no-underline"
          >
            Clear
          </button>
          <button
            onClick={handleCompare}
            disabled={selectedCCNs.length < 2}
            className="bg-background text-foreground px-6 py-4 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-alt transition"
          >
            Compare
          </button>
          <span className="font-semibold text-background">
            {selectedCCNs.length} selected
          </span>
        </div>
      )}
    </div>
  );
}
