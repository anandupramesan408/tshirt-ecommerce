'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { cart, fetchCart } = useCartStore();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => { fetchCart(); }, []);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop?category=mens', label: "Men's" },
    { href: '/shop?category=womens', label: "Women's" },
    { href: '/shop?is_featured=true', label: 'Featured' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white border-b border-stone-200 shadow-sm' : 'bg-white/95 backdrop-blur'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-stone-900">
            Thread<span className="text-brand-500">Co</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-sm font-medium tracking-wide transition-colors ${pathname === l.href ? 'text-brand-600' : 'text-stone-600 hover:text-stone-900'}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/shop" className="p-2 text-stone-600 hover:text-stone-900 transition-colors">
              <Search size={20} />
            </Link>
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 text-stone-600 hover:text-stone-900 transition-colors">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-stone-200 shadow-lg hidden group-hover:block">
                  <Link href="/orders" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">My Orders</Link>
                  <Link href="/profile" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">Profile</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-stone-50">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="p-2 text-stone-600 hover:text-stone-900 transition-colors">
                <User size={20} />
              </Link>
            )}
            <Link href="/cart" className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors">
              <ShoppingBag size={20} />
              {cart && cart.item_count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.item_count}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 text-stone-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-stone-700 hover:text-stone-900">
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-stone-100">
            {isAuthenticated ? (
              <>
                <Link href="/orders" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm text-stone-700">My Orders</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block py-2.5 text-sm text-red-600">Logout</button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm text-stone-700">Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
