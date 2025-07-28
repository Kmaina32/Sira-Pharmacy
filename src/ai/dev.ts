
'use server';
import * as admin from 'firebase-admin';

// --- IMPORTANT ---
// This script is for one-time use to set an admin user.
// 1. Fill in your project's service account credentials below.
// 2. Replace 'gmaina424@gmail.com' with the email of the user you want to make an admin.
// 3. Run this script ONCE from your terminal using: `npx tsx src/ai/dev.ts`
// 4. After running, REMOVE your service account credentials from this file.

const serviceAccount = {
  "type": "service_account",
  "project_id": "sira-pharmacy-online",
  "private_key_id": "708b0a94ee131bdfe4291b6c6bc58dbefc3a6e61",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDrjD5/d/euYkKA\niFPdNc3BU5N3yRzRVwa7JoyzpqhdLYnQVqp5AUMftND/CeyDl+qYMyx0wqnl7a0m\n6D6oc81BKOElc8nim8jfIjWkAuQZiLEvIIr+/GzHQ5lNHaG4aqkzEXypcdBWgMXy\nj/LzUddNYiQ185oQqzC6kAdWf7Fh3ZOqLBBBw41mQU3kZNuFw0LaDUEih3lBbwr1\nPObfR/IyWCHC4WYExz9y9TZaqo4hcgTIxvut6TifbVSxFb0sI1TAS3D34w+bFqpE\nJrEd4s4MOQlcCOcuRBdfHlmnjXPukMQuEQ/fUtLcyqRivAsttvZZcr/xYpw4KBCy\n4PFYkxY3AgMBAAECggEAB70d/opz+5Q53XGH2Srf3YaqlShpMc2F/extz1Hd5+B2\nTdR9xFJQy2q25RzahZZI/FgjZptQq/+2N82F5XtB1plfuvRwwRO03Ukz8aAGBiVn\nYNt/sDyd3EwcbhwCSLCkaiDxyLq3CWiGAwqiBPF+597IvscH8Z1A5sLoTXoOMLS1\nS3YzAzC0iWga2BKyhN8NiVCfIlo0s9fLJFqnruWDzuHUXcdD5ayXX8dSKqEAVJJO\nw3G81u8nHP6d4i8mQWjQHSXPssn7rvftMiEbIHVVJrrIz7HZ5VGzZtn0/pkbydux\nSlXKJWLJxULjye2ATKhdPiLbEJ4dHrpZHHSle4oXEQKBgQD6xIN+m7BsdwmdOx3j\nWggtzL4bytPT3cYQ9oXcIv+R9N+mvAMNF/6uXNbo9yPN6JufGHCyPiHZ/0HCmCoZ\nEDYy/JJzu03gJWg2ZGonA/XOcDF0J3Y+BbsDxWist4x2fcJYJWgFodXeSizA9FGl\nR3sUGgGMxO07NzkUOH5AoFZ1JwKBgQDwdm7oeYroaBOx1DuftH2f6rY7zAUAyy2a\n9fXz3KhwND1renpbHKPSkryEmfrgS4wHRr0Y0/LM1+J3CGj2k0nTy00XPiqPWp6t\n95kyggXar2/ZPEMMz7q/jjanqPO6Fz3E3Vpz770jzsIlM6Wt/XVXcDJ1hSH3RAOD\nw43qdeegcQKBgEFWurxebJWWXpbtNFhsuPzWACLVsmPdwSHiWfaF1/l7yFp1WoYq\n3l0oK4b//gBEv2ewwoxuy/s1GzlM1Is7QiP+01n8T8o7dO/XMiGAUqe7a+dL8O8w\nJw5QfXmjSaIGGoFFHdl51XPZ99c+0ZczDMqsDANVvEpVlTXDkoHcRSq5AoGBAIQy\nuFq6p3GJ9nnnkjgFBKOsaC+LxJxhF1uAKY2+HCRDtBiopyf8INydq2LDPLefEQbX\nDxLdQzj23xxN1VbqNsZnmKRUmxVg3qgJ3YF1Fj7aAIXPqZUbhzHUv5uBOS1vpZfb\nkeT3QmazPu0w7b8v/xjpJ/SQEtJb5ArGsfjahVMhAoGAN3/tqlUGAXPPz9Osk5wn\nH6yfMdo7bF7Jvmnjk5mDxbLxO5SYqnAkpSQ3IkP9uCboRYHG/nir0z2/YPHn5d2X\nzBVN2DDqA7404nz7vMP6Y00q1nbJE9nv96RiQIURnaEJx71loU2NFgszIi/jq0Ge\n1UzgN3N1DNt9JcWVJbTbVto=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@sira-pharmacy-online.iam.gserviceaccount.com",
  "client_id": "115644664181684543628",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sira-pharmacy-online.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

const adminEmail = 'gmaina424@gmail.com'; // <-- 🚨REPLACE WITH YOUR ADMIN EMAIL

async function setAdminClaim() {
    // Ensure the service account has a project_id.
    if (!serviceAccount.project_id) {
        console.error('\n🚨 ERROR: Firebase service account credentials are not set in src/ai/dev.ts.');
        console.error('Please get your service account key from Project Settings > Service accounts in the Firebase console and paste it into the script.');
        return;
    }

    // Initialize the app if it hasn't been already.
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    try {
        const auth = admin.auth();
        console.log(`Fetching user with email: ${adminEmail}...`);
        const user = await auth.getUserByEmail(adminEmail);
        
        // Check if the user is already an admin.
        if (user.customClaims?.['isAdmin']) {
            console.log(`✅ Success! ${adminEmail} is already an admin.`);
            return;
        }

        // Set the custom claim.
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

// Run the function to set the claim.
setAdminClaim();
