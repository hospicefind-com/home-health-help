import { getAllCodes } from "@/lib/hospice-data/get-code-details";
import { ProviderData } from "@/lib/types";
import { Accordion } from "@base-ui-components/react";
import { MinusCircle, NavArrowDown, PlusCircle } from "iconoir-react";

type CompareAccordionProps = {
  addable: boolean,
  data?: (ProviderData | null)[],
}

export default async function CompareAccordion({ addable, data }: CompareAccordionProps) {
  const codes = await getAllCodes();

  codes?.sort((a, b) => {
    return a.measure_code.localeCompare(b.measure_code);
  })

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
                <button className="mr-3">
                  <MinusCircle />
                </button>
                <span className="flex-1">{hospice?.facilityName}:</span>
                <span className="self-end">{hospice?.measures.find(e => e.measureCode == code.measure_code)?.score}</span>
              </div>
            ))}

            {/* Add Hospice */}
            {addable && (
              <div className="flex flex-row justify-center items-center bg-background-alt text-xl p-3">
                <span>Add Hospice</span>
                <PlusCircle className="ml-3" />
              </div>
            )}
          </Accordion.Panel>

        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
