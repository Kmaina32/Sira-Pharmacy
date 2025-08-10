
'use server';

/**
 * @fileOverview A Genkit flow for saving a user's contact message to Firestore.
 *
 * - sendContactMessage - Handles saving the message.
 * - ContactMessageInput - The input type for the sendContactMessage function.
 * - ContactMessageOutput - The return type for the sendContactMessage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ContactMessageInputSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("A valid email is required."),
  message: z.string().min(1, "Message is required."),
});
export type ContactMessageInput = z.infer<typeof ContactMessageInputSchema>;

const ContactMessageOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
export type ContactMessageOutput = z.infer<typeof ContactMessageOutputSchema>;

// Exported wrapper function to be called from the UI
export async function sendContactMessage(input: ContactMessageInput): Promise<ContactMessageOutput> {
  return sendContactMessageFlow(input);
}

const sendContactMessageFlow = ai.defineFlow(
  {
    name: 'sendContactMessageFlow',
    inputSchema: ContactMessageInputSchema,
    outputSchema: ContactMessageOutputSchema,
  },
  async (input) => {
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: input.name,
        email: input.email,
        message: input.message,
        createdAt: serverTimestamp(),
        isRead: false, // For admin tracking
      });

      return { success: true };

    } catch (err: any) {
        console.error("Error in sendContactMessageFlow: ", err);
        return {
            success: false,
            error: err.message || "An unexpected error occurred while sending the message."
        };
    }
  }
);
