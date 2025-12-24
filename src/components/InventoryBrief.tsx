"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface InventoryProduct {
    id: string;
    title: string;
    image?: string;
    category: string;
}

interface InventoryBriefProps {
    products: InventoryProduct[];
}

export function InventoryBrief({ products = [] }: InventoryBriefProps) {
    return (
        <div className="space-y-4">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                    <div className="relative h-10 w-10 rounded border border-border/50 overflow-hidden bg-muted/20">
                        {product.image ? (
                            <Image src={product.image} alt={product.title} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] uppercase">No Img</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold truncate group-hover:text-primary transition-colors">
                            {product.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            {product.category}
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-[10px] uppercase tracking-wider">
                        <Link href={`/sellers/products/auction/${product.id}`}>
                            List
                        </Link>
                    </Button>
                </div>
            ))}
            <Button variant="outline" className="w-full border-dashed text-xs py-6" asChild>
                <Link href="/sellers/products/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Product
                </Link>
            </Button>
        </div>
    );
}
