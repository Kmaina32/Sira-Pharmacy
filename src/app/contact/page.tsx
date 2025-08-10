
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/context/SettingsContext';
import { Mail, Phone, MapPin } from 'lucide-react';
import AppFooter from '@/components/AppFooter';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendContactMessage } from '@/ai/flows/send-contact-message-flow';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('A valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const { settings } = useSettings();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: '', email: '', message: '' },
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await sendContactMessage(data);
            if (result.success) {
                toast({
                    title: 'Message Sent!',
                    description: "We've received your message and will get back to you shortly.",
                });
                form.reset();
            } else {
                throw new Error(result.error || "An unknown error occurred");
            }
        } catch (error: any) {
            toast({
                title: 'Submission Failed',
                description: error.message || 'There was a problem sending your message.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };


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
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                         <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>Your Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                         <FormField control={form.control} name="message" render={({ field }) => (
                                            <FormItem><FormLabel>Your Message</FormLabel><FormControl><Textarea placeholder="Your message here..." {...field} rows={6} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                </Form>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
