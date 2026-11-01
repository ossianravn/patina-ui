import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/patina/ui/breadcrumb"
import { Button } from "@/patina/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/patina/ui/dropdown-menu"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Breadcrumb",
  description:
    "A mono trail from the top of Fieldbook to the current page, with a hand-drawn slash between each step.",
  item: "breadcrumb",
  group: "Navigation",
}

export default function BreadcrumbDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Default">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#fieldbook">Fieldbook</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#observations">
                  Observations
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Grey heron</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
        <StateRow label="Collapsed">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#fieldbook">Fieldbook</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Show the hidden steps"
                      />
                    }
                  >
                    <BreadcrumbEllipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-auto">
                    <DropdownMenuItem>Expeditions</DropdownMenuItem>
                    <DropdownMenuItem>Winter wader count</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#tidal-flats">Tidal flats</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Curlew, 05:31</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
        <StateRow label="Long trail">
          <Breadcrumb className="max-w-[20rem]">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#fieldbook">Fieldbook</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#expeditions">Expeditions</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#count">
                  Winter wader count
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Black-tailed godwit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
        <StateRow label="Custom separator">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#settings">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>·</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Appearance</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
      </DemoSection>
    </>
  )
}
