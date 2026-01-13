"use client"

import { GetCodeDetails } from "@/lib/hospice-data/get-code-details";
import { Code } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/base-ui/dropdown-menu";
import { NavArrowDown } from "iconoir-react";
import { cn } from "@/lib/utils";

type SortDropdownProps = {
  selectedValue: string;
  onSortChange: (newSortValue: string, newCode: Code) => void;
  loading?: boolean;
};

type CategorizedCodes = {
  cahps: Code[];
  hci: Code[];
  generalMetric: Code[];
};

export default function SortDropdown({ selectedValue, onSortChange, loading }: SortDropdownProps) {
  // State to hold categorized codes
  const [categorizedCodes, setCategorizedCodes] = useState<CategorizedCodes>({
    cahps: [],
    hci: [],
    generalMetric: []
  });

  // State to hold our fast-lookup map
  const [measureCodeMap, setMeasureCodeMap] = useState<Map<string, Code>>(new Map());

  const handleSelection = (measureCode: string) => {
    if (measureCode === "") {
      // Reset to alphabetical
      onSortChange("", {} as Code);
    } else {
      const codeObject = measureCodeMap.get(measureCode);
      if (codeObject) {
        onSortChange(measureCode, codeObject);
      }
    }
  };

  useEffect(() => {
    const fetchCodes = async () => {
      const codes = await GetCodeDetails("opt_sorting");

      // Categorize the codes
      const categorized: CategorizedCodes = {
        cahps: codes.filter(code => code.is_cahps),
        hci: codes.filter(code => code.is_hci),
        generalMetric: codes.filter(code => code.is_general_metric)
      };

      setCategorizedCodes(categorized);

      // Build the map once the codes are fetched
      const newMap = new Map<string, Code>();
      for (const code of codes) {
        newMap.set(code.measure_code, code);
      }
      setMeasureCodeMap(newMap);
    };
    fetchCodes();
  }, []);

  // Get the display text for the selected option
  const getSelectedText = () => {
    if (!selectedValue) return "Alphabetical Order";
    const code = measureCodeMap.get(selectedValue);
    return code?.real_desc || "Select sorting option";
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className="w-full min-w-[200px] sm:max-w-[300px] sm:w-max items-center justify-between gap-2 bg-primary rounded-full flex px-4 py-3 text-background"
          >
            <span className="truncate text-left flex-1">
              {getSelectedText()}
            </span>
            {loading ? (
              <span
                aria-label="Loading"
                className="h-5 w-5 animate-spin rounded-full border-2 border-foreground-alt border-t-primary shrink-0"
              />
            ) : (
              <NavArrowDown className="shrink-0" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[calc(100vw-16px)] sm:max-w-lg mx-2 px-1 min-w-[200px] max-h-[400px] overflow-y-auto bg-primary text-background border-none rounded-3xl"
        >
          <DropdownMenuLabel className="text-xs font-bold">
            Sort by
          </DropdownMenuLabel>

          {/* Default Option */}
          <DropdownMenuItem
            onClick={() => handleSelection("")}
            className={cn("cursor-pointer rounded-full", selectedValue === "" ? "bg-background text-foreground" : "bg-none text-background")}
          >
            <span>Alphabetical Order</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* CAHPS Category */}
          {categorizedCodes.cahps.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs font-bold">
                CAHPS (Patient Experience)
              </DropdownMenuLabel>
              {categorizedCodes.cahps.map((option) => (
                <DropdownMenuItem
                  key={option.measure_code}
                  onClick={() => handleSelection(option.measure_code)}
                  className={cn("cursor-pointer rounded-full", selectedValue === option.measure_code ? "bg-background text-foreground" : "bg-none text-background")}
                >
                  <span className="text-sm">{option.real_desc}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}

          {/* HCI Category */}
          {categorizedCodes.hci.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs font-bold">
                HCI (Hospice Care Index)
              </DropdownMenuLabel>
              {categorizedCodes.hci.map((option) => (
                <DropdownMenuItem
                  key={option.measure_code}
                  onClick={() => handleSelection(option.measure_code)}
                  className={cn("cursor-pointer rounded-full", selectedValue === option.measure_code ? "bg-background text-foreground" : "bg-none text-background")}
                >
                  <span className="text-sm">{option.real_desc}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}

          {/* General Metrics Category */}
          {categorizedCodes.generalMetric.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs font-bold">
                General Metrics
              </DropdownMenuLabel>
              {categorizedCodes.generalMetric.map((option) => (
                <DropdownMenuItem
                  key={option.measure_code}
                  onClick={() => handleSelection(option.measure_code)}
                  className={cn("cursor-pointer rounded-full", selectedValue === option.measure_code ? "bg-background text-foreground" : "bg-none text-background")}
                >
                  <span className="text-sm">{option.real_desc}</span>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}
