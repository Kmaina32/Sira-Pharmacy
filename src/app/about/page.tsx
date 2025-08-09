
'use client';

import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Syringe } from 'lucide-react';
import AppFooter from '@/components/AppFooter';

export default function AboutPage() {
    const { settings } = useSettings();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">About {settings.appName}</h1>
                        <p className="text-lg text-muted-foreground">Your trusted partner in health and wellness.</p>
                    </div>

                    <Card className="mb-12 shadow-lg">
                        <CardContent className="p-8">
                            <p className="text-base leading-relaxed mb-4">
                                Welcome to {settings.appName}! We are dedicated to providing you with the highest quality pharmaceutical products and health services right at your fingertips. Our mission is to make healthcare more accessible, convenient, and reliable for everyone.
                            </p>
                            <p className="text-base leading-relaxed">
                                From essential medications to wellness products and baby care items, we have carefully curated our inventory to meet all your family's needs. We believe in empowering our customers with the information and products they need to live healthier, happier lives.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                         <h2 className="text-3xl font-bold font-headline text-primary mb-6">Follow Our Journey</h2>
                         <Card className="max-w-sm mx-auto overflow-hidden group">
                             <Link href="https://www.instagram.com/reel/DLuL3ufKRs6/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary p-2 rounded-full text-primary-foreground">
                                          <Syringe className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">{settings.appName} on Instagram</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Image 
                                        src="https://placehold.co/400x400.png"
                                        alt="Instagram Post"
                                        width={400}
                                        height={400}
                                        className="rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint="pharmacy social media"
                                    />
                                    <div className="flex items-center justify-center mt-4 p-2 bg-secondary rounded-md">
                                        <Instagram className="w-5 h-5 mr-2 text-primary" />
                                        <p className="font-medium text-primary">View Reel on Instagram</p>
                                    </div>
                                </CardContent>
                            </Link>
                         </Card>
                    </div>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
