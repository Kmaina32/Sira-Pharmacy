
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Mail } from 'lucide-react';

const NewsletterPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const hasSubscribed = localStorage.getItem('newsletter_subscribed');
        const timer = setTimeout(() => {
            if (!hasSubscribed) {
                setIsOpen(true);
            }
        }, 5000); // Open popup after 5 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
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
            toast({ title: 'Subscribed!', description: "You're on the list. Thanks for joining!" });
            localStorage.setItem('newsletter_subscribed', 'true');
            setIsOpen(false);
        } catch (error) {
            console.error("Error subscribing to newsletter:", error);
            toast({ title: 'Subscription Failed', description: 'Could not subscribe. Please try again later.', variant: 'destructive' });
        } finally {
            setIsSubscribing(false);
        }
    };

    const handleClose = () => {
        localStorage.setItem('newsletter_subscribed', 'closed'); // Prevent it from opening again in the same session
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex justify-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <DialogTitle className="text-center font-headline text-2xl">Subscribe to Our Newsletter</DialogTitle>
                    <DialogDescription className="text-center">
                        Get the latest updates on new products and upcoming sales.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubscribing}
                        required
                    />
                    <Button type="submit" disabled={isSubscribing}>
                        {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewsletterPopup;
