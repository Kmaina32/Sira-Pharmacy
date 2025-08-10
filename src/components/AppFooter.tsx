
'use client';

import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import { Instagram, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';

const AppFooter = () => {
    const { settings } = useSettings();

    const showTutorial = () => {
        window.dispatchEvent(new Event('show-tutorial'));
    };

    return (
        <footer className="bg-secondary text-secondary-foreground py-8">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-bold font-headline text-primary">{settings.appName}</h3>
                    <p className="text-sm mt-2">&copy; {new Date().getFullYear()} {settings.appName}. All rights reserved.</p>
                </div>
                 <div className="md:col-span-1 flex flex-col items-center md:items-start gap-2">
                    <h4 className="font-semibold">Quick Links</h4>
                    <Link href="/about" className="text-sm hover:text-primary">About Us</Link>
                    <Link href="/products" className="text-sm hover:text-primary">Products</Link>
                    <Link href="/privacy-policy" className="text-sm hover:text-primary">Privacy Policy</Link>
                </div>
                <div className="md:col-span-1 flex flex-col items-center md:items-end gap-4">
                     <div className="flex justify-center md:justify-start gap-4">
                        <Link href="https://www.instagram.com/reel/DLuL3ufKRs6/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary" />
                        </Link>
                    </div>
                    <Button variant="ghost" size="sm" onClick={showTutorial} className="text-muted-foreground hover:text-primary">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Show Tutorial
                    </Button>
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
