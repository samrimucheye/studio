// src/services/affiliateLinkService.ts
'use server'; // Mark this module for server-side execution where needed

import { db } from '@/lib/firebase/config';
import type { AffiliateLink } from '@/services/affiliate-link';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy, // Import orderBy
  Timestamp, // Import Timestamp for creating new timestamps
  FirestoreError, // Import FirestoreError for specific error checking
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache'; // Import revalidatePath

// Firestore collection reference
const linksCollectionRef = collection(db, 'affiliateLinks');

// Helper to safely convert Timestamp to ISO string
const timestampToISOString = (timestamp: any): string | undefined => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  // Handle cases where it might already be a string or undefined/null
  return typeof timestamp === 'string' ? timestamp : undefined;
};


// Default affiliate links to show if the database is empty
// Use ISO strings for timestamps here as well
const defaultLinks: AffiliateLink[] = [
  {
    id: 'default-link-1',
    productName: 'High-Performance Laptop',
    description: 'Boost your productivity with this top-tier laptop, perfect for work and play.',
    imageUrl: 'https://picsum.photos/100/100?random=1',
    affiliateUrl: 'https://www.amazon.com/dp/EXAMPLE_LAPTOP_ASIN', // Replace with actual ASIN/link
    userId: 'system',
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(), // Example fixed date
  },
  {
    id: 'default-link-2',
    productName: 'Wireless Noise-Cancelling Headphones',
    description: 'Immerse yourself in sound with these comfortable, high-fidelity headphones.',
    imageUrl: 'https://picsum.photos/100/100?random=2',
    affiliateUrl: 'https://www.amazon.com/dp/EXAMPLE_HEADPHONES_ASIN', // Replace with actual ASIN/link
    userId: 'system',
    createdAt: new Date('2024-01-01T10:05:00Z').toISOString(), // Example fixed date
  },
  {
    id: 'default-link-3',
    productName: 'Ergonomic Office Chair',
    description: 'Support your back and improve posture with this adjustable ergonomic chair.',
    imageUrl: 'https://picsum.photos/100/100?random=3',
    affiliateUrl: 'https://www.amazon.com/dp/EXAMPLE_CHAIR_ASIN', // Replace with actual ASIN/link
    userId: 'system',
    createdAt: new Date('2024-01-01T10:10:00Z').toISOString(), // Example fixed date
  },
];


/**
 * Fetches all affiliate links from Firestore, ordered by productName.
 * Converts Timestamps to ISO strings.
 * If no links are found in Firestore, returns a default set of links.
 * @returns A promise that resolves to an array of AffiliateLink objects with string timestamps.
 */
export async function getAffiliateLinks(): Promise<AffiliateLink[]> {
  if (!db) {
    console.error("Firestore is not initialized in getAffiliateLinks. This usually means Firebase environment variables are missing or incorrect in your deployment environment. Ensure NEXT_PUBLIC_FIREBASE_* variables are set.");
    // Return default links deterministically if DB is unavailable
    return defaultLinks.map(link => ({ ...link }));
  }
  try {
    // Query links ordered by product name
    const q = query(linksCollectionRef, orderBy("createdAt", "desc")); // Order by creation time, newest first
    const querySnapshot = await getDocs(q);

    const links = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        productName: data.productName || 'Unnamed Product', // Provide defaults
        description: data.description || 'No description available.',
        imageUrl: data.imageUrl || 'https://picsum.photos/100/100?random=placeholder', // Default placeholder
        affiliateUrl: data.affiliateUrl || '#',
        userId: data.userId,
        // Convert timestamps to ISO strings safely
        createdAt: timestampToISOString(data.createdAt),
        updatedAt: timestampToISOString(data.updatedAt),
      } as AffiliateLink;
    });

    // If no links are found in Firestore, return the default ones
    if (links.length === 0) {
      console.log("No links found in Firestore, returning default links.");
       // Return copies to avoid accidental mutation
      return defaultLinks.map(link => ({ ...link }));
    }

    return links;
  } catch (error) {
    console.error("Error fetching affiliate links:", error);
    if (error instanceof FirestoreError) {
        console.error(`Firestore Error Code: ${error.code}`);
        console.error(`Firestore Error Message: ${error.message}`);
         throw new Error(`Failed to fetch links. Database error: ${error.code}. Check Firestore rules and ensure Firebase environment variables are correctly set in your deployment.`);
    }
     // Wrap the original error
     throw new Error(`Failed to fetch links due to an unexpected server error: ${(error as Error).message}. This could be due to missing Firebase environment variables or incorrect Firestore setup.`);
  }
}

/**
 * Adds a new affiliate link to Firestore.
 * @param userId The ID of the user adding the link.
 * @param linkData The data for the new affiliate link (excluding the ID).
 * @returns A promise that resolves with the ID of the newly added link.
 * @throws Error if Firestore is not initialized, user is not logged in, or if a Firestore error occurs.
 */
export async function addAffiliateLink(userId: string, linkData: Omit<AffiliateLink, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<{ id: string }> {
   if (!db) {
    console.error("[Service: Add] Firestore (db) is not initialized. This usually means Firebase environment variables are missing or incorrect in your deployment environment (e.g., Netlify). Ensure NEXT_PUBLIC_FIREBASE_* variables are correctly set.");
    throw new Error("Database service is unavailable. Cannot add link. Please check server configuration and environment variables.");
  }
  if (!userId) {
     console.error("[Service: Add] Attempted to add link without userId.");
    throw new Error("User must be logged in to add links.");
  }
  try {
     console.log("[Service: Add] Attempting to add link for user:", userId, "with data:", JSON.stringify(linkData));
    const docRef = await addDoc(linksCollectionRef, {
      ...linkData,
      userId: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log("[Service: Add] Link added successfully with ID:", docRef.id);
    revalidatePath('/');
    return { id: docRef.id };
  } catch (error) {
    console.error("[Service: Add] Error adding affiliate link:", error);
    if (error instanceof FirestoreError) {
         console.error(`[Service: Add] Firestore Error Code: ${error.code}`);
         console.error(`[Service: Add] Firestore Error Message: ${error.message}`);
         if (error.code === 'permission-denied' || error.code === 'PERMISSION_DENIED' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
            throw new Error("PERMISSION_DENIED: You do not have permission to add links. Please check Firestore security rules and ensure you are authenticated with the correct user. Also, confirm Firebase environment variables are correctly set in your deployment.");
         }
         throw new Error(`Failed to add affiliate link. Database Error: ${error.message} (Code: ${error.code}). Check Firestore rules and environment variables.`);
    }
    // Check if the error message already indicates a permission issue, even if not a FirestoreError instance
    if ((error as Error).message && (error as Error).message.includes('PERMISSION_DENIED')) {
        throw new Error(`Failed to add affiliate link: PERMISSION_DENIED. Ensure Firebase environment variables are correct and Firestore rules allow writes for authenticated users.`);
    }
    throw new Error(`Failed to add affiliate link due to an unexpected server error: ${(error as Error).message}. This might be due to missing Firebase environment variables or incorrect Firestore setup.`);
  }
}

/**
 * Updates an existing affiliate link in Firestore.
 * Checks if the link ID is a default link ID before proceeding.
 * @param linkId The ID of the link to update.
 * @param linkData The updated data for the affiliate link.
 * @returns A promise that resolves when the link is updated.
 * @throws Error if the update fails, including permission errors or attempting to update default links.
 */
export async function updateAffiliateLink(linkId: string, linkData: Partial<Omit<AffiliateLink, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
   if (!db) {
    console.error("[Service: Update] Firestore is not initialized. This usually means Firebase environment variables are missing or incorrect in your deployment environment. Ensure NEXT_PUBLIC_FIREBASE_* variables are set.");
    throw new Error("Database service is unavailable. Cannot update link. Please check server configuration and environment variables.");
  }
   if (linkId.startsWith('default-link-')) {
      console.warn("[Service: Update] Attempted to update a default link. This action is forbidden.");
      throw new Error("DEFAULT_LINK_UPDATE_FORBIDDEN");
    }
  try {
     console.log("[Service: Update] Attempting to update link:", linkId, "with data:", JSON.stringify(linkData));
    const linkDocRef = doc(db, 'affiliateLinks', linkId);
    await updateDoc(linkDocRef, {
        ...linkData,
        updatedAt: Timestamp.now(),
    });
    console.log("[Service: Update] Link updated successfully:", linkId);
     revalidatePath('/');
  } catch (error) {
    console.error("[Service: Update] Error updating affiliate link:", error);
     if (error instanceof FirestoreError) {
         console.error(`[Service: Update] Firestore Error Code: ${error.code}`);
          console.error(`[Service: Update] Firestore Error Message: ${error.message}`);
           if (error.code === 'permission-denied' || error.code === 'PERMISSION_DENIED' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
                throw new Error("PERMISSION_DENIED: You do not have permission to update links. Please check Firestore security rules and ensure you are authenticated as an admin. Also, confirm Firebase environment variables are correctly set in your deployment.");
           }
            if (error.code === 'not-found') {
                throw new Error(`Failed to update link: Document with ID ${linkId} not found.`);
           }
         throw new Error(`Failed to update affiliate link. Database Error: ${error.message} (Code: ${error.code}). Check Firestore rules and environment variables.`);
    }
    if ((error as Error).message && (error as Error).message.includes('PERMISSION_DENIED')) {
        throw new Error(`Failed to update link: PERMISSION_DENIED. Ensure Firebase environment variables are correct and Firestore rules allow writes for administrators.`);
    }
    throw new Error(`Failed to update affiliate link due to an unexpected server error: ${(error as Error).message}. This might be due to missing Firebase environment variables or incorrect Firestore setup.`);
  }
}

/**
 * Deletes an affiliate link from Firestore.
 * Checks if the link ID is a default link ID before proceeding.
 * @param linkId The ID of the link to delete.
 * @returns A promise that resolves when the link is deleted.
 * @throws Error if the deletion fails, including permission errors or attempting to delete default links.
 */
export async function deleteAffiliateLink(linkId: string): Promise<void> {
  if (!db) {
    console.error("[Service: Delete] Firestore is not initialized. This usually means Firebase environment variables are missing or incorrect in your deployment environment. Ensure NEXT_PUBLIC_FIREBASE_* variables are set.");
    throw new Error("Database service is unavailable. Cannot delete link. Please check server configuration and environment variables.");
  }
   if (linkId.startsWith('default-link-')) {
      console.warn("[Service: Delete] Attempted to delete a default link. This action is forbidden.");
      throw new Error("DEFAULT_LINK_DELETE_FORBIDDEN");
   }
  try {
    console.log("[Service: Delete] Attempting to delete link:", linkId);
    const linkDocRef = doc(db, 'affiliateLinks', linkId);
    await deleteDoc(linkDocRef);
    console.log("[Service: Delete] Link deleted successfully:", linkId);
    revalidatePath('/');
  } catch (error) {
    console.error("[Service: Delete] Error deleting affiliate link:", error);
     if (error instanceof FirestoreError) {
         console.error(`[Service: Delete] Firestore Error Code: ${error.code}`);
          console.error(`[Service: Delete] Firestore Error Message: ${error.message}`);
           if (error.code === 'permission-denied' || error.code === 'PERMISSION_DENIED' || (error.message && error.message.includes('PERMISSION_DENIED'))) {
                console.error("[Service: Delete] Permission Denied! Check Firestore rules and ensure admin authentication.");
                throw new Error("PERMISSION_DENIED: You do not have permission to delete links. Please check Firestore security rules and ensure you are authenticated as an admin. Also, confirm Firebase environment variables are correctly set in your deployment.");
           } else if (error.code === 'not-found') {
               console.warn("[Service: Delete] Document not found:", linkId);
               return;
           }
         throw new Error(`Failed to delete affiliate link. Database Error: ${error.message} (Code: ${error.code}). Check Firestore rules and environment variables.`);
    }
    if ((error as Error).message && (error as Error).message.includes('PERMISSION_DENIED')) {
        throw new Error(`Failed to delete link: PERMISSION_DENIED. Ensure Firebase environment variables are correct and Firestore rules allow writes for administrators.`);
    }
    throw new Error(`Failed to delete affiliate link due to an unexpected server error: ${(error as Error).message}. This might be due to missing Firebase environment variables or incorrect Firestore setup.`);
  }
}
