"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Github } from "lucide-react";

const footerLinks = {
    shop: [
        { label: "Collections", href: "#" },
        { label: "Essentials", href: "#" },
        { label: "Accessories", href: "#" },
        { label: "Latest Drops", href: "#" },
    ],
    company: [
        { label: "About Us", href: "#" },
        { label: "Sustainability", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Terms of Service", href: "#" },
    ],
    support: [
        { label: "Contact", href: "#" },
        { label: "Shipping & Returns", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Privacy Policy", href: "#" },
    ],
};

export function Footer() {
    return (
        <footer className="mt-12 rounded-[32px] border border-zinc-100 bg-white/80 p-10 shadow-xl backdrop-blur-sm">
            <div className="mx-auto">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/nextshop" className="text-xl font-semibold tracking-tight text-zinc-900">
                            next<span className="text-[oklch(0.58_0.15_256.18)]">shop</span>
                        </Link>
                        <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                            Curated essentials for the modern creative. Designed with precision, built for longevity.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
                            <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} label="Instagram" />
                            <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} label="Facebook" />
                            <SocialLink href="#" icon={<Github className="h-4 w-4" />} label="GitHub" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-semibold text-zinc-900 mb-4">Shop</h3>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            {footerLinks.shop.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-zinc-900 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-zinc-900 mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-zinc-900 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-zinc-900 mb-4">Support</h3>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-zinc-900 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
                    <p>&copy; {new Date().getFullYear()} NextShop Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-zinc-600 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-zinc-600 transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-zinc-600 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="rounded-full bg-zinc-100 p-2 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900"
            aria-label={label}
        >
            {icon}
        </Link>
    );
}
