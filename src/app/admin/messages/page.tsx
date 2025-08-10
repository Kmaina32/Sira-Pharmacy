
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  isRead: boolean;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
        setLoading(false);
        return;
    }

    const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgsList);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching messages: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, authLoading]);

  const handleMarkAsRead = async (id: string) => {
    if (!isAdmin) return;
    const messageRef = doc(db, 'contact_messages', id);
    await updateDoc(messageRef, { isRead: true });
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  if (loading || authLoading) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Messages</h1>
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
        <div className="flex items-center justify-between">
            <div className='space-y-1'>
                 <h1 className="text-3xl font-bold font-headline">Contact Messages</h1>
                 <p className="text-muted-foreground">Messages submitted through the contact form.</p>
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
                <Accordion type="multiple" className="w-full">
                    {messages.map(msg => (
                        <AccordionItem key={msg.id} value={msg.id} className="border-b">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                                <div className="flex items-center gap-4 flex-1">
                                    <Avatar>
                                        <AvatarFallback>{getInitials(msg.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold">{msg.name}</p>
                                        <p className="text-sm text-muted-foreground">{msg.email}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className="text-xs text-muted-foreground">
                                             {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt.seconds * 1000), { addSuffix: true }) : 'N/A'}
                                        </span>
                                        {!msg.isRead && <Badge>New</Badge>}
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 pt-0">
                                <div className="prose dark:prose-invert max-w-none bg-secondary/50 p-4 rounded-md">
                                    <p>{msg.message}</p>
                                </div>
                                {!msg.isRead && (
                                    <Button size="sm" variant="outline" className="mt-4" onClick={() => handleMarkAsRead(msg.id)}>
                                        <Check className="mr-2 h-4 w-4" />
                                        Mark as Read
                                    </Button>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                {messages.length === 0 && (
                    <p className="p-6 text-center text-muted-foreground">No messages yet.</p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
