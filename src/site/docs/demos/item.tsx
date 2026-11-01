import { Fragment, type ComponentProps } from "react"
import { ChevronRightIcon, MapPinIcon, MoreHorizontalIcon } from "lucide-react"
import { Print } from "@/patina/print/print"
import { Badge } from "@/patina/ui/badge"
import { Button } from "@/patina/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/patina/ui/item"
import { EXPEDITIONS } from "@/site/fieldbook/expeditions"
import { when } from "@/site/fieldbook/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Item",
  description:
    "A typeset row for one record in a list, like an index entry: number, title, a one-line hook and its actions.",
  item: "item",
  group: "Data display",
}

const COLUMN = "w-full max-w-[36rem]"

function Heron({
  variant,
  size,
}: Pick<ComponentProps<typeof Item>, "variant" | "size">) {
  return (
    <Item variant={variant} size={size} className={COLUMN}>
      <ItemMedia variant="image">
        <Print motif="horizon" seed="obs-0412" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Grey heron</ItemTitle>
        <ItemDescription>
          Still for eleven minutes, then a single strike.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Actions for Grey heron"
        >
          <MoreHorizontalIcon />
        </Button>
      </ItemActions>
    </Item>
  )
}

export default function ItemDemo() {
  return (
    <>
      <DemoSection title="Index">
        <ItemGroup className={COLUMN}>
          {EXPEDITIONS.slice(0, 4).map((e, i) => (
            <Fragment key={e.id}>
              {i > 0 ? <ItemSeparator /> : null}
              <Item role="listitem" size="sm">
                <ItemMedia variant="number">
                  {String(i + 1).padStart(2, "0")}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{e.name}</ItemTitle>
                  <ItemDescription className="line-clamp-1">
                    {e.aim}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </ItemActions>
              </Item>
            </Fragment>
          ))}
        </ItemGroup>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="default">
          <Heron />
        </StateRow>
        <StateRow label="outline">
          <Heron variant="outline" />
        </StateRow>
        <StateRow label="muted">
          <Heron variant="muted" />
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="default">
          <Heron variant="outline" />
        </StateRow>
        <StateRow label="sm">
          <Heron variant="outline" size="sm" />
        </StateRow>
        <StateRow label="xs">
          <Item variant="outline" size="xs" className={COLUMN}>
            <ItemMedia variant="image">
              <Print motif="sprig" seed="obs-0410" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Bittern</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge>Rare</Badge>
            </ItemActions>
          </Item>
        </StateRow>
      </DemoSection>
      <DemoSection title="Media and links">
        <StateRow label="Icon">
          <Item variant="outline" className={COLUMN}>
            <ItemMedia variant="icon">
              <MapPinIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Sluice gate</ItemTitle>
              <ItemDescription>
                Where the creek meets the drain; kingfishers in the cold months.
              </ItemDescription>
            </ItemContent>
          </Item>
        </StateRow>
        <StateRow label="As a link">
          <Item
            variant="outline"
            className={COLUMN}
            render={<a href="#bittern-watch" />}
          >
            <ItemMedia variant="image">
              <Print motif="sprig" seed="exp-15" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Bittern watch</ItemTitle>
              <ItemDescription>
                Dusk watch over the reed bed after Friday's booming.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4 text-ink-2 rtl:-scale-x-100" />
            </ItemActions>
          </Item>
        </StateRow>
        <StateRow label="With footer">
          <Item variant="outline" className={COLUMN}>
            <ItemMedia variant="number">01</ItemMedia>
            <ItemContent>
              <ItemTitle>Winter wader count</ItemTitle>
              <ItemDescription>
                The monthly count of waders on the falling tide, flats to
                saltings.
              </ItemDescription>
            </ItemContent>
            <ItemFooter className="label-mono text-ink-3">
              <span>Meet at the Sluice gate</span>
              <span>{when("2026-11-14T05:30")}</span>
            </ItemFooter>
          </Item>
        </StateRow>
      </DemoSection>
    </>
  )
}
