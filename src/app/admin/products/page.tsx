import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="container-lux">
      <p> products page</p>
      <Link href={`/admin/products/auctions/123`} className="text-blue-400">
        to the auctions page
      </Link>
    </div>
  );
}
