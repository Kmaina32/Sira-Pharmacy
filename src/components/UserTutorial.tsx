
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Search, LayoutGrid, ShoppingCart, User, Lightbulb } from 'lucide-react';
import Image from 'next/image';

const tutorialSteps = [
    {
        title: 'Welcome to Your Pharmacy!',
        description: "Let's take a quick tour to see how you can make the most of our online store.",
        icon: Lightbulb,
        image: 'https://placehold.co/400x200.png',
        aiHint: 'friendly welcome illustration',
    },
    {
        title: 'Find Products Easily',
        description: 'Use the search bar at the top of the Products page to quickly find any item you need.',
        icon: Search,
        image: 'https://placehold.co/400x200.png',
        aiHint: 'magnifying glass search',
    },
    {
        title: 'Shop by Category',
        description: 'Browse our curated categories to discover products for wellness, baby care, first aid, and more.',
        icon: LayoutGrid,
        image: 'https://placehold.co/400x200.png',
        aiHint: 'product categories grid',
    },
    {
        title: 'Your Shopping Cart',
        description: 'Click the cart icon in the header to view your selected items, adjust quantities, and proceed to checkout.',
        icon: ShoppingCart,
        image: 'https://placehold.co/400x200.png',
        aiHint: 'shopping cart icon',
    },
    {
        title: 'Manage Your Account',
        description: "Sign up or log in to track your orders, manage your shipping details, and enjoy a faster checkout experience.",
        icon: User,
        image: 'https://placehold.co/400x200.png',
        aiHint: 'user profile account',
    },
];

const UserTutorial = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const tutorialSeen = localStorage.getItem('pharmacy_tutorial_seen');
        if (!tutorialSeen) {
            setIsOpen(true);
        }

        const handleShowTutorial = () => setIsOpen(true);
        window.addEventListener('show-tutorial', handleShowTutorial);

        return () => {
             window.removeEventListener('show-tutorial', handleShowTutorial);
        }
    }, []);

    const handleNext = () => {
        if (step < tutorialSteps.length - 1) {
            setStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        localStorage.setItem('pharmacy_tutorial_seen', 'true');
        setIsOpen(false);
        // Reset to first step for next time it's opened manually
        setTimeout(() => setStep(0), 300);
    };

    const currentStep = tutorialSteps[step];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={handleClose}>
                <DialogHeader>
                     <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                        <currentStep.icon className="h-8 w-8 text-primary" />
                    </div>
                    <DialogTitle className="text-center font-headline text-2xl">{currentStep.title}</DialogTitle>
                    <DialogDescription className="text-center text-base pt-2">
                        {currentStep.description}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4 mb-6 text-center">
                    <Image
                        src={currentStep.image}
                        alt={currentStep.title}
                        width={400}
                        height={200}
                        className="rounded-lg object-cover mx-auto"
                        data-ai-hint={currentStep.aiHint}
                    />
                </div>

                <DialogFooter className="flex-row justify-between w-full">
                    <div className="text-sm text-muted-foreground">
                        Step {step + 1} of {tutorialSteps.length}
                    </div>
                    <div className="flex gap-2">
                        {step > 0 && (
                             <Button variant="outline" onClick={handlePrev}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                        )}
                        <Button onClick={handleNext}>
                            {step === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                             <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </DialogFooter>
                 <Button variant="link" className="absolute top-4 right-4" onClick={handleClose}>Skip</Button>
            </DialogContent>
        </Dialog>
    );
};

export default UserTutorial;
