
'use client';

import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import { Instagram } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';

const AppFooter = () => {
    const { settings } = useSettings();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            toast({ title: 'Email required', description: 'Please enter your email address.', variant: 'destructive' });
            return;
        }
        setIsSubscribing(true);
        try {
            await addDoc(collection(db, 'newsletter'), {
                email,
                subscribedAt: serverTimestamp(),
            });
            toast({ title: 'Subscribed!', description: 'Thanks for joining our newsletter.' });
            setEmail('');
        } catch (error) {
            console.error("Error subscribing to newsletter:", error);
            toast({ title: 'Subscription Failed', description: 'Could not subscribe. Please try again.', variant: 'destructive' });
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <footer className="bg-secondary text-secondary-foreground py-12">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h3 className="text-lg font-bold font-headline text-primary">{settings.appName}</h3>
                    <p className="text-sm mt-2">&copy; {new Date().getFullYear()} {settings.appName}. All rights reserved.</p>
                     <div className="flex justify-center md:justify-start gap-4 mt-4">
                        <Link href="https://www.instagram.com/reel/DLuL3ufKRs6/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary" />
                        </Link>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold font-headline">Quick Links</h3>
                    <ul className="mt-2 space-y-1">
                        <li><Link href="/about" className="text-sm hover:text-primary">About Us</Link></li>
                        <li><Link href="/products" className="text-sm hover:text-primary">Products</Link></li>
                        <li><Link href="/contact" className="text-sm hover:text-primary">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold font-headline">Newsletter</h3>
                    <p className="text-sm mt-2">Stay up to date with our latest news and offers.</p>
                    <form className="flex gap-2 mt-4" onSubmit={handleNewsletterSubmit}>
                        <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="bg-background flex-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubscribing}
                        />
                        <Button type="submit" disabled={isSubscribing}>
                            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                        </Button>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
