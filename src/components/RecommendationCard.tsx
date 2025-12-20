import Image from "next/image";
import Link from "next/link";

interface RecommendationProps {
  id: string;
  name: string;
  price: string;
  image: string;
  brand?: string;
  estimate?: string;
}

export default function RecommendationCard({
  product,
}: {
  product: RecommendationProps;
}) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="min-w-[280px] snap-start group cursor-pointer block"
    >
      <div className="relative aspect-square bg-muted mb-4 overflow-hidden">
        <Image
          src={
            product.image ||
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop"
          }
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h4 className="font-serif text-lg mb-1">{product.brand || "Brand"}</h4>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
        {product.name}
      </p>
      {product.estimate && (
        <p className="text-xs font-medium">Estimate: {product.estimate}</p>
      )}
      {!product.estimate && (
        <p className="text-xs font-medium">{product.price}</p>
      )}
    </Link>
  );
}
