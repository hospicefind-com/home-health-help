"use client"

import { Menu } from "@base-ui-components/react"
import { ChevronDown } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { GetCodeDetails } from "@/lib/hospice-data/get-code-details";
import { Code } from "@/lib/types";
import { useEffect, useState } from "react";

type CategorizedCodes = {
  cahps: Code[];
  hci: Code[];
  generalMetric: Code[];
};

export default function SortByDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categorizedCodes, setCategorizedCodes] = useState<CategorizedCodes>({
    cahps: [],
    hci: [],
    generalMetric: []
  });
  const [measureCodeMap, setMeasureCodeMap] = useState<Map<string, Code>>(new Map());

  const selectedText = searchParams.get("sort") || "Alphabetical Order";

  const handleValueChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", newValue);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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

  return (
    <div className="bg-background pt-4">
      <Menu.Root>
        <Menu.Trigger className="w-full min-w-[200px] items-center justify-between gap-2 bg-primary rounded-3xl flex p-3 text-background data-[popup-open]:rounded-b-none">
          <div>
            {selectedText}
          </div>
          <ChevronDown />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup className="overflow-y-scroll bg-primary text-background w-[calc(100vw-16px)] rounded-b-3xl px-1 pb-1">
              <Menu.RadioGroup value={selectedText} onValueChange={handleValueChange}>
                <div className="font-bold">Sort By</div>
                <Menu.RadioItem closeOnClick value=""
                  className="p-3 rounded-3xl data-[checked]:bg-background data-[checked]:text-foreground"
                >
                  Alphabetical Order
                </Menu.RadioItem>
                {/* CAHPS Category */}
                {categorizedCodes.cahps.length > 0 && (
                  <>
                    <div className="font-bold">CAHPS (Patient Experience)</div>
                    {categorizedCodes.cahps.map((option) => (
                      <Menu.RadioItem
                        key={option.measure_code}
                        value={option.measure_code}
                        className="p-3 rounded-3xl data-[checked]:bg-background data-[checked]:text-foreground"
                      >
                        {option.real_desc}
                      </Menu.RadioItem>
                    ))}
                  </>
                )}
                <Menu.RadioItem closeOnClick value="State Average"
                  className="p-3 rounded-3xl data-[checked]:bg-background data-[checked]:text-foreground"
                >
                  State Average
                </Menu.RadioItem>
                <Menu.RadioItem closeOnClick value="National Average"
                  className="p-3 rounded-3xl data-[checked]:bg-background data-[checked]:text-foreground"
                >
                  National Average
                </Menu.RadioItem>
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <hr className="border-1 border-foreground mt-4" />
    </div>
  )
}
