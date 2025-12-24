"use client";

import { AuctionTable } from "@/components/AuctionTable";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CircleDollarSign,
  Gavel,
  LayoutDashboard,
  PlusCircle,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuctionStore } from "@/hooks/useAuction";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

function StatsCard({ title, value, description, icon, trend, trendPositive }: StatsCardProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-muted/30 transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span className={`text-xs font-medium ${trendPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend}
            </span>
          )}
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { useUserAuctions } = useAuctionStore();
  const { data: auctionData, isLoading: isAuctionLoading } = useUserAuctions();

  const stats = [
    {
      title: "Total Revenue",
      value: "GH₵ 45,231.89",
      description: "from last 30 days",
      icon: <CircleDollarSign className="h-4 w-4" />,
      trend: "+12.5%",
      trendPositive: true
    },
    {
      title: "Active Auctions",
      value: "12",
      description: "currently live",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Total Bids",
      value: "1,542",
      description: "all time bids",
      icon: <Gavel className="h-4 w-4" />,
      trend: "+18%",
      trendPositive: true
    },
    {
      title: "Conversion Rate",
      value: "64.2%",
      description: "bids to sales",
      icon: <TrendingUp className="h-4 w-4" />,
      trend: "+4.3%",
      trendPositive: true
    }
  ];

  if (!auctionData && !isAuctionLoading) {
    return <div>No auctions found</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Seller Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your auctions today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="hidden md:flex">
            <Link href="/sellers/products">
              View Inventory
            </Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-medium tracking-wide">
            <Link href="/sellers/products/new" className="flex items-center gap-2 px-4">
              <PlusCircle className="h-4 w-4" />
              <span>Add Product</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Monitoring Table */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              Auction Monitor
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </h2>
            <Button variant="ghost" size="sm" asChild className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">
              <Link href="/sellers/auctions" className="flex items-center gap-2">
                Live View <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          <AuctionTable auctions={auctionData?.data as any} isLoading={isAuctionLoading} />
        </div>
      </div>
    </div>
  );
}
