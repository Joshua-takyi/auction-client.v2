"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import {
  LayoutDashboard,
  Gavel,
  Box,
  Users,
  Settings,
  PlusCircle,
} from "lucide-react";
import { NavItem } from "@/components/AppSidebar";

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Auctions",
    url: "/admin/auctions",
    icon: Gavel,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Box,
    items: [
      {
        title: "All Products",
        url: "/admin/products",
      },
      {
        title: "Create Product",
        url: "/admin/create-product",
      },
    ],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={adminNavItems} title="Admin Panel">
      {children}
    </DashboardLayout>
  );
}
