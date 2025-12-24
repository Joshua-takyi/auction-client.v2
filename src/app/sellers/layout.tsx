"use client";

import { NavItem } from "@/components/AppSidebar";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  BarChart3,
  Box,
  Gavel,
  LayoutDashboard,
  Settings
} from "lucide-react";

const sellerNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/sellers/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Products",
    url: "/sellers/products",
    icon: Box,
    items: [
      {
        title: "All Products",
        url: "/sellers/products",
      },
      {
        title: "Add New Product",
        url: "/sellers/products/new",
      },
    ],
  },
  {
    title: "My Auctions",
    url: "/sellers/auctions",
    icon: Gavel,
  },
  {
    title: "Sales Analytics",
    url: "/sellers/sales",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/sellers/settings",
    icon: Settings,
    isDialog: true,
  },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={sellerNavItems} title="Seller Dashboard">
      {children}
    </DashboardLayout>
  );
}
