
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export interface Brand {
    id: string;
    name: string;
    logoUrl: string;
}

const brandSchema = z.object({
  name: z.string().min(2, 'Brand name is required'),
  logoUrl: z.string().url('Must be a valid image URL'),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
  brand?: Brand | null;
  onSuccess: () => void;
}

export function BrandForm({ brand, onSuccess }: BrandFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: brand || { name: '', logoUrl: '' },
  });

  const onSubmit = async (data: BrandFormValues) => {
    setIsSubmitting(true);
    try {
      if (brand) {
        const brandRef = doc(db, 'brands', brand.id);
        await updateDoc(brandRef, data);
        toast({ title: 'Brand Updated', description: `${data.name} has been updated.` });
      } else {
        await addDoc(collection(db, 'brands'), data);
        toast({ title: 'Brand Added', description: `${data.name} has been added.` });
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save brand:', error);
      toast({ title: 'Error', description: 'Failed to save brand.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Brand Name</FormLabel><FormControl><Input placeholder="Coca-Cola" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="logoUrl" render={({ field }) => (
          <FormItem><FormLabel>Logo URL</FormLabel><FormControl><Input placeholder="https://example.com/logo.png" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Brand'}</Button>
      </form>
    </Form>
  );
}
