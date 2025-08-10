
'use server';

/**
 * @fileOverview A Genkit flow for sending newsletters as in-app notifications.
 *
 * - sendNewsletter - Handles fetching subscribers and creating notification documents in Firestore.
 * - SendNewsletterInput - The input type for the sendNewsletter function.
 * - SendNewsletterOutput - The return type for the sendNewsletter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getDocs, collection, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SendNewsletterInputSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  content: z.string().min(1, "Content is required."),
});
export type SendNewsletterInput = z.infer<typeof SendNewsletterInputSchema>;

const SendNewsletterOutputSchema = z.object({
  success: z.boolean(),
  sentCount: z.number(),
  error: z.string().optional(),
});
export type SendNewsletterOutput = z.infer<typeof SendNewsletterOutputSchema>;

// Exported wrapper function to be called from the UI
export async function sendNewsletter(input: SendNewsletterInput): Promise<SendNewsletterOutput> {
  return sendNewsletterFlow(input);
}

const sendNewsletterFlow = ai.defineFlow(
  {
    name: 'sendNewsletterFlow',
    inputSchema: SendNewsletterInputSchema,
    outputSchema: SendNewsletterOutputSchema,
  },
  async (input) => {
    try {
      // 1. Fetch all newsletter subscribers
      const newsletterSubscribersSnapshot = await getDocs(collection(db, 'newsletter'));
      const subscriberEmails = newsletterSubscribersSnapshot.docs.map(doc => doc.data().email);

      if (subscriberEmails.length === 0) {
        return { success: true, sentCount: 0 };
      }

      // 2. Fetch all registered users whose email is in the subscribers list
      const usersQuery = query(collection(db, 'users'), where('email', 'in', subscriberEmails));
      const usersSnapshot = await getDocs(usersQuery);
      const userIds = usersSnapshot.docs.map(doc => doc.id);

      // 3. Create a notification for each subscribed user
      const notificationPromises = userIds.map(userId => 
        addDoc(collection(db, 'notifications'), {
          userId,
          subject: input.subject,
          content: input.content,
          isRead: false,
          createdAt: serverTimestamp(),
        })
      );
      
      await Promise.all(notificationPromises);

      return {
        success: true,
        sentCount: userIds.length,
      };

    } catch (err: any) {
        console.error("Error in sendNewsletterFlow: ", err);
        return {
            success: false,
            sentCount: 0,
            error: err.message || "An unexpected error occurred while sending the newsletter."
        };
    }
  }
);
