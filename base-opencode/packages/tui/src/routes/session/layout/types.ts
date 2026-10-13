import type { JSX } from "@opentui/solid"

export interface AsymmetricLayoutProps {
  sidebar: JSX.Element
  main: JSX.Element
  mascotHeader?: JSX.Element
  sidebarWidth?: number
}
