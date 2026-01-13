'use client'

import { Code, ProviderData } from "@/lib/types";
import { Accordion } from "@base-ui-components/react";
import { MinusCircle, NavArrowDown, PlusCircle } from "iconoir-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type CompareAccordionProps = {
  addable: boolean,
  codes: Code[],
  data?: (ProviderData | null)[],
}

export default function CompareAccordion({ addable, codes, data }: CompareAccordionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  codes?.sort((a, b) => {
    return a.measure_code.localeCompare(b.measure_code);
  })

  function deleteCCN(ccn: string | undefined) {
    const newParams = new URLSearchParams(searchParams.toString());

    newParams.delete('ccn', ccn);

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }

  function addCCN() {
    const params = new URLSearchParams(searchParams.toString());

    router.push(`compare/add?${params.toString()}`);
  }

  return (
    <Accordion.Root>
      {codes.map((code) => (
        <Accordion.Item key={code.id} className="mb-3">

          {/* Accordion Head */}
          <Accordion.Trigger className="bg-primary text-background w-full font-dongle text-4xl/7 text-left p-3 flex flex-row justify-center items-center">
            <span className="flex-1">
              {code.real_desc}
            </span>
            <NavArrowDown />
          </Accordion.Trigger>

          {/* Accordion Body */}
          <Accordion.Panel>
            {data?.map((hospice) => (
              <div key={hospice?.ccn} className="flex flex-row p-3 border-b border-foreground text-xl">
                <button onClick={() => deleteCCN(hospice?.ccn)} className="mr-3">
                  <MinusCircle />
                </button>
                <span className="flex-1">{hospice?.facilityName}:</span>
                <span className="self-end">{hospice?.measures.find(e => e.measureCode == code.measure_code)?.score}</span>
              </div>
            ))}

            {/* Add Hospice */}
            {addable && (
              <button onClick={() => addCCN()} className="flex flex-row justify-center items-center bg-background-alt text-xl p-3 w-full">
                <span>Add Hospice</span>
                <PlusCircle className="ml-3" />
              </button>
            )}
          </Accordion.Panel>

        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
