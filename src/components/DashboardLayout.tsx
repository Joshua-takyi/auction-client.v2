"use client";

import * as React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar, NavItem } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title?: string;
}

export function DashboardLayout({
  children,
  navItems,
  title = "Dashboard",
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar navItems={navItems} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/50 px-6 sticky top-0 bg-background/80 backdrop-blur-md z-20">
          <SidebarTrigger className="-ml-1 border border-border/50 hover:bg-accent transition-colors" />
          <Separator orientation="vertical" className="h-4 bg-border/50" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-muted-foreground/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground">
                  {title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-4">
            {/* Additional header items like search or notifications can go here */}
          </div>
        </header>
        <main className="flex-1 bg-muted/20">
          <div className="p-6 md:p-8 lg:p-10 transition-all">
            <div className="mx-auto max-w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
