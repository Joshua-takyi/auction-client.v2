import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import RecommendationsSection from "@/components/RecommendationsSection";
import { getAuctionByID } from "@/lib/data";
import TimeLeft from "@/components/timeInterval";
import { convertCurrency } from "@/utils";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const auctionID = slug.split("--").pop();

  if (!auctionID) notFound();

  const auction = await getAuctionByID(auctionID);
  if (!auction) {
    notFound();
  }

  console.log(auction.auction);

  const recom = auction.products.category;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container-lux pt-6 pb-4 flex justify-between items-center  border-b border-border/40 mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
          <Link href="/" className="hover:text-foreground my-2">
            {auction.products.brand}
          </Link>
          {/* <span className="text-foreground">Lot {auction.id.slice(0, 4)}</span> */}
          {/* <span>/</span> */}
        </div>
      </div>

      <div className="container-lux grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-12 lg:gap-x-5">
        {/* Images */}

        <ProductGallery
          images={auction.products.images}
          name={auction.products.title}
        />

        {/* Details - Sticky */}
        <div className="md:sticky md:top-24 h-fit space-y-8 animate-fade-in pl-0 md:pl-4">
          {/* Header Actions - Simplified */}
          <div className="flex justify-end items-center gap-4 text-muted-foreground text-sm">
            <span className="font-medium text-foreground">GHS</span>
            <button
              className="hover:text-foreground transition-colors group"
              aria-label="Share"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:scale-110 transition-transform"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button
              className="hover:text-foreground transition-colors group"
              aria-label="Print"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:scale-110 transition-transform"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect width="12" height="8" x="6" y="14" />
              </svg>
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-serif font-medium text-[#111] mb-1">
              {auction.products.brand}
            </h2>
            <h1 className="text-xl text-muted-foreground font-light leading-snug">
              {auction.products.title}
            </h1>
            <p className="mt-4 text-xs text-muted-foreground underline underline-offset-4 cursor-pointer hover:text-foreground transition-colors">
              AURUM Auctions
            </p>
          </div>

          <div className="space-y-6 pt-4 border-t border-border/50">
            <div>
              <span className="block text-xs text-muted-foreground mb-1">
                Lot closes
              </span>
              <div className="text-sm font-medium">
                <TimeLeft endTime={auction.end_time} />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <span className="block text-xs text-muted-foreground mb-1">
                Estimate
              </span>
              <p className="text-sm font-medium">
                {convertCurrency(auction.estimated_price)}
              </p>
            </div>

            <div className="pt-4 border-t border-border/50 flex justify-between items-end">
              <div>
                <span className="block text-xs text-muted-foreground mb-1">
                  Current Bid
                </span>
                <p className="text-2xl font-serif font-medium">
                  {convertCurrency(auction.current_bid)}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-xs text-muted-foreground">
                  Active Auction
                </span>
                <span className="block text-xs text-muted-foreground">
                  Reserve met
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <Link
                href={`/bid/${auction.id}`}
                className="block w-full text-center py-4 bg-[#0a1f35] text-white text-sm font-medium hover:bg-[#152c4a] transition-colors uppercase tracking-widest shadow-lg"
              >
                Register to Bid
              </Link>
            </div>
          </div>

          <div className="bg-muted/10 p-4 rounded flex gap-4 text-xs text-muted-foreground leading-relaxed">
            <div className="mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <p>
              We may charge or debit your saved payment method subject to the
              terms set out in our Conditions of Business for Buyers.{" "}
              <span className="underline cursor-pointer">Read more.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="py-10">
        <Recommendations recom={recom} auctionId={auction.id} />
      </div>
    </div>
  );
}

function Recommendations({
  recom,
  auctionId,
}: {
  recom: string;
  auctionId: string;
}) {
  return (
    <RecommendationsSection recommendation={recom} currentId={auctionId} />
  );
}
