import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"
import { ChevronDownIcon } from "lucide-react"

// A row of mono links, like the site header. The current page carries the highlighter stroke (a link with `active`
// gets aria-current="page"); hovering only firms the ink. In the row the stroke is drawn on ::before, so it never
// shifts a link's padding or text. Triggers open their panel on a sheet of card stock that morphs between panels;
// panel links tint the paper on hover, and a current one highlights its first child (its title). The trigger style
// restates every type and spacing property, so it fully replaces the panel look on a top-level link.
const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger relative isolate inline-flex h-control-compact w-max cursor-pointer items-center justify-center gap-1 rounded-sheet px-tight py-0 font-label text-label leading-[1.45] font-medium tracking-[0.06em] whitespace-nowrap text-ink-2 uppercase no-underline transition-colors select-none before:pointer-events-none before:absolute before:inset-x-1.5 before:inset-y-2.5 before:-z-10 hover:bg-transparent hover:text-ink disabled:pointer-events-none disabled:text-ink-faint aria-disabled:pointer-events-none aria-disabled:text-ink-faint data-active:text-ink data-active:before:highlight data-popup-open:text-ink",
)

function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align">) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group m-0 flex flex-1 list-none items-center justify-center gap-hair p-0",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-px size-3 text-ink-3 transition duration-200 group-data-popup-open/navigation-menu-trigger:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-auto p-hair transition-[opacity,transform,translate] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-[activation-direction=left]:data-ending-style:translate-x-[50%] data-[activation-direction=left]:data-starting-style:translate-x-[-50%] data-[activation-direction=right]:data-ending-style:translate-x-[-50%] data-[activation-direction=right]:data-starting-style:translate-x-[50%]",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0",
          className,
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="float-sheet relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) text-ink outline-none transition-[opacity,transform,width,height,scale,translate] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-95 data-starting-style:opacity-0">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "relative isolate flex items-center gap-tight rounded-sheet px-tight py-hair text-small leading-small text-ink no-underline transition-colors hover:bg-paper-3/50 data-active:*:first:highlight [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] size-2 rotate-45 rounded-tl-[2px] bg-rule" />
    </NavigationMenuPrimitive.Icon>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
}
