import { getAllCodes } from "@/lib/hospice-data/get-code-details";
import { Accordion } from "@base-ui-components/react";
import { NavArrowDown } from "iconoir-react";

type CompareAccordionProps = {
  addable: boolean,
}

export default async function CompareAccordion({ addable }: CompareAccordionProps) {
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
            Stupid chud
          </Accordion.Panel>

        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
