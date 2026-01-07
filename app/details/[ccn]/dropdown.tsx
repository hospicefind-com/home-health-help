"use client"

import { Menu } from "@base-ui-components/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown() {
  const [selectedText, setSelectedText] = useState("Overview")

  return (
    <Menu.Root>
      <Menu.Trigger className="w-full min-w-[200px] items-center justify-between gap-2 bg-primary rounded-3xl flex p-3 text-background data-[popup-open]:rounded-b-none">
        <div>
          {selectedText}
        </div>
        <ChevronDown />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup className="bg-primary text-background w-[calc(100vw-16px)] rounded-b-3xl px-1 pb-1">
            <Menu.RadioGroup value={selectedText} onValueChange={setSelectedText}>
              <Menu.RadioItem closeOnClick value="Overview"
                className="p-3 rounded-3xl data-[checked]:bg-background data-[checked]:text-foreground"
              >
                Overview
              </Menu.RadioItem>
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
  )
}
