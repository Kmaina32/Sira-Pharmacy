
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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Progress } from '@/components/ui/progress';

const settingsSchema = z.object({
  appName: z.string().min(3, 'App name must be at least 3 characters'),
  whatsAppNumber: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^(\d{1,3}\s\d{1,3}%\s\d{1,3}%)$/, 'Must be a valid HSL color string (e.g., "210 70% 50%")'),
  accentColor: z.string().regex(/^(\d{1,3}\s\d{1,3}%\s\d{1,3}%)$/, 'Must be a valid HSL color string (e.g., "180 60% 40%")'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { settings, updateSettings, loading } = useSettings();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: {
        appName: settings.appName,
        whatsAppNumber: settings.whatsAppNumber,
        primaryColor: settings.primaryColor,
        accentColor: settings.accentColor,
    },
    resetOptions: {
      keepDirtyValues: true,
    }
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
    }
  }

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSubmitting(true);
    let heroImageUrl = settings.heroImageUrl;

    try {
      if (heroImageFile) {
        setUploadProgress(0);
        const storageRef = ref(storage, `hero-images/${heroImageFile.name}-${Date.now()}`);
        const uploadTask = await uploadBytes(storageRef, heroImageFile);
        
        // This is a simplification; for real progress, you'd use uploadTask.on from the SDK
        // but for a simple progress bar this should suffice to show activity.
        setUploadProgress(100); 

        heroImageUrl = await getDownloadURL(uploadTask.ref);
        setHeroImageFile(null);
      }
      
      const settingsToUpdate = {
        ...data,
        heroImageUrl,
      };

      await updateSettings(settingsToUpdate);
      toast({ title: 'Settings Updated', description: 'Your store settings have been saved.' });
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({ title: 'Error', description: 'Failed to update settings.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
        setUploadProgress(null);
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

              <FormField control={form.control} name="whatsAppNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. 254757586253" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormItem>
                <FormLabel>Hero Image</FormLabel>
                <FormControl>
                    <Input type="file" accept="image/*" onChange={handleFileChange} className="file:text-primary file:font-medium" />
                </FormControl>
                {uploadProgress !== null && <Progress value={uploadProgress} className="mt-2" />}
                <FormMessage />
              </FormItem>

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
