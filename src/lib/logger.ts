import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

type LogType = 'info' | 'success' | 'warning' | 'error';

/**
 * Logs an event to the Firestore 'logs' collection.
 * This is used to create an audit trail for important admin actions.
 * @param type - The type of log entry.
 * @param event - A short name for the event (e.g., 'User Signup').
 * @param description - A more detailed description of what happened.
 */
export const logEvent = async (type: LogType, event: string, description: string) => {
  try {
    if (!db) {
      console.error("Firestore instance is not available. Skipping log.");
      return;
    }
    await addDoc(collection(db, 'logs'), {
      type,
      event,
      description,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to write to audit log:', error);
  }
};
