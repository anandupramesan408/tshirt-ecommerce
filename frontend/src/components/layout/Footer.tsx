import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <p className="font-display text-2xl font-bold text-white mb-3">
              Thread<span className="text-brand-400">Co</span>
            </p>
            <p className="text-sm leading-relaxed">Premium quality t-shirts crafted for everyday comfort and lasting style.</p>
            <div className="flex gap-4 mt-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="text-stone-500 hover:text-white transition-colors"><Icon size={18} /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-300 mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {["All Products", "Men's", "Women's", "Featured"].map(l => (
                <li key={l}><Link href="/shop" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-300 mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm">
              {["FAQ", "Shipping & Returns", "Size Guide", "Contact Us"].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-300 mb-4">Newsletter</h4>
            <p className="text-sm mb-3">Get 10% off your first order.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-stone-800 border border-stone-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-stone-500 placeholder:text-stone-600" />
              <button className="bg-brand-500 text-white text-sm px-4 py-2 hover:bg-brand-600 transition-colors font-medium">Join</button>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-600">
          <p>© {new Date().getFullYear()} ThreadCo. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-stone-400">Privacy Policy</a>
            <a href="#" className="hover:text-stone-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
