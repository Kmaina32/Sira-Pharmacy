
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const settingsSchema = z.object({
  appName: z.string().min(3, 'App name must be at least 3 characters'),
  whatsAppNumber: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^(\d{1,3}\s\d{1,3}%\s\d{1,3}%)$/, 'Must be a valid HSL color string (e.g., "210 70% 50%")'),
  accentColor: z.string().regex(/^(\d{1,3}\s\d{1,3}%\s\d{1,3}%)$/, 'Must be a valid HSL color string (e.g., "180 60% 40%")'),
  heroImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  stripePublishableKey: z.string().optional().or(z.literal('')),
  paypalClientId: z.string().optional().or(z.literal('')),
  tutorialStep1ImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tutorialStep2ImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tutorialStep3ImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tutorialStep4ImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tutorialStep5ImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { settings, updateSettings, loading } = useSettings();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: {
        appName: settings.appName,
        whatsAppNumber: settings.whatsAppNumber,
        primaryColor: settings.primaryColor,
        accentColor: settings.accentColor,
        heroImageUrl: settings.heroImageUrl,
        stripePublishableKey: settings.stripePublishableKey || '',
        paypalClientId: settings.paypalClientId || '',
        tutorialStep1ImageUrl: settings.tutorialStep1ImageUrl || '',
        tutorialStep2ImageUrl: settings.tutorialStep2ImageUrl || '',
        tutorialStep3ImageUrl: settings.tutorialStep3ImageUrl || '',
        tutorialStep4ImageUrl: settings.tutorialStep4ImageUrl || '',
        tutorialStep5ImageUrl: settings.tutorialStep5ImageUrl || '',
    },
    resetOptions: {
      keepDirtyValues: true,
    }
  });
  
  const onSubmit = async (data: SettingsFormValues) => {
    setIsSubmitting(true);
    try {
      await updateSettings(data);
      toast({ title: 'Settings Updated', description: 'Your store settings have been saved.' });
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({ title: 'Error', description: 'Failed to update settings.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (loading) {
      return (
          <div className="space-y-8">
              <h1 className="text-3xl font-bold font-headline">Settings</h1>
              <Card>
                  <CardHeader><CardTitle>Store Customization</CardTitle><CardDescription>Customize the look and feel of your storefront.</CardDescription></CardHeader>
                  <CardContent className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-24" />
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                    <CardTitle>Store Customization</CardTitle>
                    <CardDescription>Customize the look and feel of your storefront.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="appName" render={({ field }) => (
                            <FormItem>
                            <FormLabel>App Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="whatsAppNumber" render={({ field }) => (
                            <FormItem>
                            <FormLabel>WhatsApp Number</FormLabel>
                            <FormControl><Input {...field} placeholder="e.g. 254757586253" /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        
                        <FormField control={form.control} name="heroImageUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hero &amp; Auth Background Image URL</FormLabel>
                                <FormControl><Input {...field} placeholder="https://example.com/image.png" /></FormControl>
                                <FormDescription>
                                    This image is for the homepage hero and the login/signup page backgrounds.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="primaryColor" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Primary Color (HSL)</FormLabel>
                            <FormControl><Input {...field} placeholder="210 70% 50%" /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="accentColor" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Accent Color (HSL)</FormLabel>
                            <FormControl><Input {...field} placeholder="180 60% 40%" /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Payment Gateway APIs</CardTitle>
                        <CardDescription>Enter your API keys for payment processing. These are stored securely and are not visible on the client-side.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="stripePublishableKey" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stripe Publishable Key</FormLabel>
                                <FormControl><Input {...field} placeholder="pk_test_..." /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="paypalClientId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>PayPal Client ID</FormLabel>
                                <FormControl><Input {...field} placeholder="AZ..." /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Onboarding Tutorial Images</CardTitle>
                        <CardDescription>Manage the images that appear in the new user tutorial.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Tutorial Step 1: Welcome</AccordionTrigger>
                                <AccordionContent>
                                     <FormField control={form.control} name="tutorialStep1ImageUrl" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL for Step 1</FormLabel>
                                            <FormControl><Input {...field} placeholder="https://example.com/welcome.png" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-2">
                                <AccordionTrigger>Tutorial Step 2: Find Products</AccordionTrigger>
                                <AccordionContent>
                                     <FormField control={form.control} name="tutorialStep2ImageUrl" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL for Step 2</FormLabel>
                                            <FormControl><Input {...field} placeholder="https://example.com/search.png" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-3">
                                <AccordionTrigger>Tutorial Step 3: Shop by Category</AccordionTrigger>
                                <AccordionContent>
                                     <FormField control={form.control} name="tutorialStep3ImageUrl" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL for Step 3</FormLabel>
                                            <FormControl><Input {...field} placeholder="https://example.com/category.png" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-4">
                                <AccordionTrigger>Tutorial Step 4: Shopping Cart</AccordionTrigger>
                                <AccordionContent>
                                     <FormField control={form.control} name="tutorialStep4ImageUrl" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL for Step 4</FormLabel>
                                            <FormControl><Input {...field} placeholder="https://example.com/cart.png" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-5">
                                <AccordionTrigger>Tutorial Step 5: Manage Account</AccordionTrigger>
                                <AccordionContent>
                                     <FormField control={form.control} name="tutorialStep5ImageUrl" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL for Step 5</FormLabel>
                                            <FormControl><Input {...field} placeholder="https://example.com/account.png" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
              
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save All Settings'}</Button>
            </form>
          </Form>
    </div>
  );
}

    