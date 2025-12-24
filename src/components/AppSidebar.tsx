"use client";

import { ChevronRight, Gavel, type LucideIcon } from "lucide-react";

import { NavUser } from "@/components/navUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Settings as SettingsDialog } from "./settings";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  defaultOpen?: boolean;
  isDialog?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navItems: NavItem[];
}

export function AppSidebar({ navItems, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50"
      {...props}
    >
      <SidebarHeader className="">
        <Link
          href="/"
          className="flex items-center gap-2 group-data-[collapsible=icon]:hidden"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Gavel className="size-4" />
          </div>
        </Link>
        <Link
          href="/"
          className="hidden h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-data-[collapsible=icon]:flex"
        >
          <Gavel className="size-4" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const hasItems = item.items && item.items.length > 0;
              const isChildActive =
                hasItems &&
                item.items?.some(
                  (sub) =>
                    pathname === sub.url || pathname.startsWith(sub.url + "/")
                );
              const isActive =
                pathname === item.url ||
                pathname.startsWith(item.url + "/") ||
                isChildActive;

              const buttonContent = (
                <>
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-primary" : ""
                    )}
                  />
                  <span>{item.title}</span>
                </>
              );

              const content = (
                <SidebarMenuItem key={item.title}>
                  {hasItems ? (
                    <Collapsible
                      defaultOpen={item.defaultOpen || isChildActive}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isActive}
                          className={cn(
                            "transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              isActive ? "text-primary" : ""
                            )}
                          />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l border-border/50 ml-4 pl-2 mt-1">
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link
                                  href={subItem.url}
                                  className={cn(
                                    "text-xs transition-colors",
                                    pathname === subItem.url
                                      ? "text-primary font-medium"
                                      : "text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : item.isDialog && item.title === "Settings" ? (
                    <SettingsDialog>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        className={cn(
                          "transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {buttonContent}
                      </SidebarMenuButton>
                    </SettingsDialog>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Link href={item.url}>{buttonContent}</Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );

              return content;
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-2">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
