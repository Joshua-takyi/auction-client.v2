import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="container-lux grid md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tighter block"
          >
            AURUM
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The premier destination for discovering and collecting the world's
            most extraordinary objects.
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-4">Auctions</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-foreground">
                Current
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Upcoming
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Past Results
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Sell with Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4">Stay Informed</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter for exclusive updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-b border-border py-2 text-sm w-full focus:outline-none focus:border-foreground transition-colors"
            />
            <button className="text-sm border-b border-foreground uppercase tracking-widest hover:opacity-70">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="container-lux border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
        <p>&copy; 2024 AURUM Auctions. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-foreground">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
