
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { sendNewsletter } from '@/ai/flows/send-newsletter-flow';

interface Subscription {
  id: string;
  email: string;
  subscribedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const newsletterSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long'),
  content: z.string().min(20, 'Content must be at least 20 characters long'),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function AdminNewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { subject: '', content: '' },
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
        setLoading(false);
        return;
    }

    const q = query(collection(db, 'newsletter'), orderBy('subscribedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const subsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription));
      setSubscriptions(subsList);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching newsletter subscriptions: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, authLoading]);

  const onSubmit: SubmitHandler<NewsletterFormValues> = async (data) => {
    setIsSending(true);
    try {
        const result = await sendNewsletter(data);
        if (result.success) {
            toast({
                title: 'Newsletter Sent!',
                description: `Your message has been queued for sending to ${result.sentCount} subscribers.`,
            });
            form.reset();
        } else {
            throw new Error(result.error || "An unknown error occurred");
        }
    } catch (error: any) {
        toast({
            title: 'Failed to Send Newsletter',
            description: error.message || 'There was a problem sending the newsletter.',
            variant: 'destructive',
        });
    } finally {
        setIsSending(false);
    }
  };
  
  if (loading || authLoading) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Newsletter</h1>
            <Card><CardContent><p>Loading...</p></CardContent></Card>
        </div>
    );
  }

  if (!isAdmin) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Access Denied</h1>
            <Card><CardHeader><CardTitle>Permission Required</CardTitle></CardHeader>
            <CardContent><p>You do not have permission to view this page.</p></CardContent></Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Newsletter Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Compose & Send Newsletter</CardTitle>
                <CardDescription>Create a message and send it to all subscribers as an in-app notification.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="Exciting News!" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={form.control} name="content" render={({ field }) => (
                            <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Hello everyone..." {...field} rows={8} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <Button type="submit" disabled={isSending}>
                            <Send className="mr-2 h-4 w-4" />
                            {isSending ? 'Sending...' : 'Send to Subscribers'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribed Emails</CardTitle>
            <CardDescription>A list of all users subscribed to your newsletter.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead className="text-right">Subscription Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell><div className="font-medium">{sub.email}</div></TableCell>
                    <TableCell className="text-right">
                      {sub.subscribedAt ? format(new Date(sub.subscribedAt.seconds * 1000), 'PPP') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
