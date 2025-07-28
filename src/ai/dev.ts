
'use server';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// --- IMPORTANT ---
// This script is for one-time use to set an admin user.
// 1. Fill in your project's service account credentials below.
// 2. Replace 'gmaina424@gmail.com' with the email of the user you want to make an admin.
// 3. Run this script ONCE from your terminal using: `npx tsx src/ai/dev.ts`
// 4. After running, REMOVE your service account credentials from this file.

const serviceAccount = {
  // PASTE YOUR FIREBASE SERVICE ACCOUNT KEY JSON HERE
  // Example:
  // "type": "service_account",
  // "project_id": "your-project-id",
  // "private_key_id": "your-private-key-id",
  // "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  // "client_email": "firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com",
  // "client_id": "...",
  // "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  // "token_uri": "https://oauth2.googleapis.com/token",
  // "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  // "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-..."
};

const adminEmail = 'gmaina424@gmail.com'; // <-- 🚨REPLACE WITH YOUR ADMIN EMAIL

let adminApp: App;
if (!getApps().some(app => app.name === 'adminApp')) {
    adminApp = initializeApp({
        credential: {
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key,
        },
    }, 'adminApp');
} else {
    adminApp = getApps().find(app => app.name === 'adminApp')!;
}


async function setAdminClaim() {
    if (!serviceAccount.project_id) {
        console.error('\n🚨 ERROR: Firebase service account credentials are not set in src/ai/dev.ts.');
        console.error('Please get your service account key from Project Settings > Service accounts in the Firebase console and paste it into the script.');
        return;
    }
    
    try {
        const auth = getAuth(adminApp);
        console.log(`Fetching user with email: ${adminEmail}...`);
        const user = await auth.getUserByEmail(adminEmail);
        
        if (user.customClaims?.['isAdmin']) {
            console.log(`✅ Success! ${adminEmail} is already an admin.`);
            return;
        }

        console.log(`Setting 'isAdmin' custom claim for ${adminEmail}...`);
        await auth.setCustomUserClaims(user.uid, { isAdmin: true });
        console.log(`✅ Success! ${adminEmail} has been granted admin privileges.`);
        console.log('Please log out and log back into the application for the changes to take effect.');

    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            console.error(`\n🚨 ERROR: User with email "${adminEmail}" not found in Firebase Authentication.`);
            console.error('Please ensure the user has signed up in the application first.');
        } else {
             console.error('\n🚨 An unexpected error occurred:');
             console.error(error);
        }
    }
}

setAdminClaim();
