"use client";

import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Auction } from "@/hooks/useAuction";
import { cn } from "@/lib/utils";
import Image from "next/image";
import TimeLeft from "./timeInterval";

interface AuctionTableProps {
    auctions: Auction[];
    isLoading?: boolean;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
    }).format(amount);
};

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case "active":
        case "live":
            return "bg-green-500/10 text-green-500 border-green-500/20";
        case "pending":
            return "bg-orange-500/10 text-orange-500 border-orange-500/20";
        case "completed":
        case "ended":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        case "closed":
            return "bg-slate-500/10 text-slate-500 border-slate-500/20";
        default:
            return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
};

export function AuctionTable({ auctions = [], isLoading }: AuctionTableProps) {
    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                        <TableHead className="w-[100px] uppercase text-[10px] tracking-widest font-bold">Product</TableHead>
                        <TableHead className="uppercase text-[10px] tracking-widest font-bold">Name</TableHead>
                        <TableHead className="uppercase text-[10px] tracking-widest font-bold">Reserve Price</TableHead>
                        <TableHead className="uppercase text-[10px] tracking-widest font-bold">Highest Bid</TableHead>
                        <TableHead className="uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
                        <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Ends in</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {auctions.map((auction) => (
                        <TableRow key={auction.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                            <TableCell>
                                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border/50 bg-muted/20">
                                    {auction.products?.images?.[0] ? (
                                        <Image
                                            src={auction.products.images[0]}
                                            alt={auction.products.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm line-clamp-1">{auction.products?.title}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{auction.category}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                                {formatCurrency(auction.reserve_price || 0)}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-mono text-sm font-bold text-primary">
                                        {formatCurrency(auction.current_bid || auction.start_price)}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {auction.current_bid ? "Current High" : "Starting Price"}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={cn("text-[9px] uppercase tracking-tighter px-2 py-0.5 rounded-full border", getStatusColor(auction.status || ""))}
                                >
                                    {auction.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="text-xs">
                                    <TimeLeft endTime={auction.end_time} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {auctions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                No active auctions found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
