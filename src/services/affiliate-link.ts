
import type { Timestamp } from 'firebase/firestore'; // Keep Timestamp import for reference/type checking in service

/**
 * Represents an affiliate link.
 */
export interface AffiliateLink {
  /**
   * Unique identifier for the link (usually Firestore document ID).
   */
  id: string;
  /**
   * The name of the product.
   */
  productName: string;
  /**
   * The description of the product.
   */
  description: string;
  /**
   * The URL of the product image.
   */
  imageUrl: string;
  /**
   * The affiliate URL.
   */
  affiliateUrl: string;
  /**
   * The ID of the user who added the link (optional, added by Firestore service).
   */
  userId?: string;
   /**
   * Timestamp string (ISO format) when the link was created (optional, added by Firestore service).
   */
  createdAt?: string; // Changed from Timestamp to string
   /**
   * Timestamp string (ISO format) when the link was last updated (optional, added by Firestore service).
   */
  updatedAt?: string; // Changed from Timestamp to string
}

/**
 * DEPRECATED: This function is likely no longer needed as data is fetched from Firestore.
 * Consider removing it or updating it if there's still a use case for a non-Firestore fetch.
 *
 * Asynchronously retrieves affiliate link information for a given product name.
 *
 * @param productName The name of the product to search for.
 * @returns A promise that resolves to an AffiliateLink object containing product information.
 */
export async function getAffiliateLink(productName: string): Promise<AffiliateLink> {
  // This is a placeholder implementation.
  console.warn("getAffiliateLink service function is deprecated. Use Firestore service functions instead.");

  return {
    id: Math.random().toString(36).substring(7), // Generate a simple random ID
    productName: 'Example Product',
    description: 'This is an example product description.',
    imageUrl: 'https://example.com/image.jpg',
    affiliateUrl: 'https://example.com/affiliate-link',
    createdAt: new Date().toISOString(), // Use ISO string for consistency
  };
}
