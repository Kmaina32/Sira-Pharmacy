'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, categories } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const productSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  description: z.string().min(10, 'Description is too short'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  category: z.enum(['medication', 'wellness', 'baby-care', 'personal-care', 'first-aid']),
  stock: z.coerce.number().min(0, 'Stock must be a positive number'),
  usage: z.string().min(10, 'Usage instructions are required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  aiHint: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSuccess: (product: Omit<Product, 'id'>) => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
        ...product,
        price: product.price || 0,
        stock: product.stock || 0,
    } : {
      name: '',
      description: '',
      price: 0,
      category: 'medication',
      stock: 0,
      usage: '',
      imageUrl: '',
      aiHint: '',
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const productData = {
        ...data,
        imageUrl: data.imageUrl || `https://placehold.co/400x400.png?text=${encodeURIComponent(data.name)}`,
        aiHint: data.aiHint || data.name.toLowerCase().split(' ').slice(0,2).join(' '),
      };

      if (product) {
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, productData);
        toast({ title: 'Product Updated', description: `${data.name} has been updated.` });
      } else {
        await addDoc(collection(db, 'products'), productData);
        toast({ title: 'Product Added', description: `${data.name} has been added.` });
      }
      onSuccess(productData);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast({ title: 'Error', description: 'Failed to save product.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="usage" render={({ field }) => (
            <FormItem><FormLabel>Usage Instructions</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="stock" render={({ field }) => (
            <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem><FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
              <SelectContent>
                {categories.filter(c => c.value !== 'all').map(category => (
                  <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          <FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="aiHint" render={({ field }) => (
            <FormItem><FormLabel>AI Hint (Optional)</FormLabel><FormControl><Input placeholder="e.g. 'painkiller pills'" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Product'}</Button>
      </form>
    </Form>
  );
}
