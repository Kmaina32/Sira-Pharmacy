
'use client';

import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/context/SettingsContext';
import { Mail, Phone, MapPin } from 'lucide-react';
import AppFooter from '@/components/AppFooter';

export default function ContactPage() {
    const { settings } = useSettings();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">Contact Us</h1>
                        <p className="text-lg text-muted-foreground">We'd love to hear from you. Get in touch with us.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                             <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                          <Mail className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle>Email Us</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p>Send us an email for any inquiries.</p>
                                    <a href="mailto:support@sirapharmacy.com" className="text-primary font-semibold hover:underline">
                                        support@sirapharmacy.com
                                    </a>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                         <div className="bg-primary/10 p-3 rounded-full">
                                          <Phone className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle>Call Us</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p>Speak to our customer service team.</p>
                                     <a href={`tel:${settings.whatsAppNumber}`} className="text-primary font-semibold hover:underline">
                                        {settings.whatsAppNumber}
                                    </a>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                     <div className="flex items-center gap-4">
                                         <div className="bg-primary/10 p-3 rounded-full">
                                          <MapPin className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle>Our Location</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p>123 Moi Avenue, Nairobi, Kenya</p>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card className="p-8 shadow-lg">
                                <h2 className="text-2xl font-bold font-headline mb-6">Send a Message</h2>
                                <form className="space-y-4">
                                    <Input placeholder="Your Name" />
                                    <Input type="email" placeholder="Your Email" />
                                    <Textarea placeholder="Your Message" rows={6} />
                                    <Button type="submit" className="w-full">Send Message</Button>
                                </form>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
