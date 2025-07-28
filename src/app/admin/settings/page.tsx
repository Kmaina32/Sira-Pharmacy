'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const settingsSchema = z.object({
  appName: z.string().min(3, 'App name must be at least 3 characters'),
  heroImageUrl: z.string().url('Must be a valid URL'),
  primaryColor: z.string().regex(/^(\d{1,3}\s\d{1,3}%\s\d{1,3}%)$/, 'Must be a valid HSL color string (e.g., "210 70% 50%")'),
  accentColor: z.string().regex(/^(\d{1,3}\s\d{1,3}%\s\d{1,3}%)$/, 'Must be a valid HSL color string (e.g., "180 60% 40%")'),
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
        heroImageUrl: settings.heroImageUrl,
        primaryColor: settings.primaryColor,
        accentColor: settings.accentColor,
    },
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

      <Card>
        <CardHeader>
          <CardTitle>Store Customization</CardTitle>
          <CardDescription>Customize the look and feel of your storefront.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="appName" render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="heroImageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image URL</FormLabel>
                  <FormControl><Input {...field} placeholder="https://placehold.co/1920x1080.png" /></FormControl>
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
              
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Settings'}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
