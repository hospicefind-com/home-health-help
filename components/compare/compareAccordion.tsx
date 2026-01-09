import { getAllCodes } from "@/lib/hospice-data/get-code-details";
import { Accordion } from "@base-ui-components/react";

export default async function CompareAccordion() {
  const codes = await getAllCodes();

  return (
    <Accordion.Root>
      {codes.map((code) => (
        <Accordion.Item key={code.id} className="mb-3">
          <Accordion.Trigger className="bg-primary text-background w-full font-dongle text-3xl text-left p-3">
            {code.real_desc}
          </Accordion.Trigger>
          <Accordion.Panel>
            Stupid chud
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
