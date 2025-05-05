
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AffiliateLinkDisplay from '@/components/AffiliateLinkDisplay';
import LinkManagement from '@/components/LinkManagement';
import AiDescription from '@/components/AiDescription';
import { AffiliateLink } from '@/services/affiliate-link';
import { getAffiliateLinks, addAffiliateLink, updateAffiliateLink, deleteAffiliateLink } from '@/services/affiliateLinkService';
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import { FirestoreError } from 'firebase/firestore'; // Import FirestoreError


export default function Home() {
  const { user, loading: authLoading, isAdmin } = useAuth(); // Get user, loading, and isAdmin state
  const queryClient = useQueryClient(); // Get query client instance
  const [editingLink, setEditingLink] = useState<AffiliateLink | null>(null);

  // Fetch affiliate links using react-query
  const { data: links = [], isLoading: linksLoading, error: linksError } = useQuery<AffiliateLink[], Error>({
    queryKey: ['affiliateLinks'], // Unique key for this query
    queryFn: getAffiliateLinks, // Function to fetch data
    staleTime: 0, // Set staleTime to 0 to ensure immediate refetch on invalidation
  });

   // Mutation for adding a new link (Available to any logged-in user)
  const addLinkMutation = useMutation({
    mutationFn: (newLinkData: Omit<AffiliateLink, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
      if (!user) throw new Error("User not logged in.");
      // No admin check needed for adding
      return addAffiliateLink(user.uid, newLinkData);
    },
    onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['affiliateLinks'] }); // Invalidate cache
        toast({ title: "Success!", description: "Affiliate link added successfully." });
        setEditingLink(null); // Clear editing state if any
        document.getElementById('link-management-card')?.scrollIntoView({ behavior: 'smooth' }); // Scroll to top of form
    },
    onError: (error: Error) => {
        // Log the full error for debugging
        console.error("Add Link Mutation Error:", error);
        let description = `Failed to add link: ${error.message || 'An unexpected server error occurred.'}`;

        // Provide more specific feedback based on common errors
        if (error.message.includes("User must be logged in")) {
            description = "You must be logged in to add links.";
        } else if (error.message.includes("PERMISSION_DENIED")) {
             description = "Permission denied. Please check Firestore rules or contact support.";
        } else if (error.message.includes("Database service is unavailable")) {
            description = "Cannot connect to the database. Please check configuration or try again later.";
        } else if (error.message.includes("Database Error:")) {
             // Extract code if available
             const codeMatch = error.message.match(/\(Code: (.*?)\)/);
             const code = codeMatch ? codeMatch[1] : 'unknown';
             description = `Failed to add link. Database error: ${code}`;
        }

        toast({
          title: "Error Adding Link",
          description: description,
          variant: "destructive"
        });
    },
  });

  // Mutation for updating an existing link (only admin)
  const updateLinkMutation = useMutation({
    mutationFn: (updatedLink: AffiliateLink) => {
       // **Crucial:** Double-check admin status *before* attempting update
       if (!isAdmin) throw new Error("PERMISSION_DENIED"); // Use a specific error type/message
       // Ensure we have an ID - service function handles default link check
       if (!updatedLink.id) {
           throw new Error("INVALID_LINK_ID"); // Should not happen if UI is correct
       }
       const { id, userId, createdAt, ...updateData } = updatedLink; // Exclude fields that shouldn't be directly updated this way
       return updateAffiliateLink(id, updateData); // Call the service function
    },
    onSuccess: (data, updatedLink) => {
        queryClient.invalidateQueries({ queryKey: ['affiliateLinks'] }); // Invalidate cache
        toast({ title: "Success!", description: "Affiliate link updated successfully." });
        setEditingLink(null); // Clear editing state
    },
     onError: (error: Error) => {
        console.error("Update Link Mutation Error:", error); // More specific logging
        let description = `Failed to update link: ${error.message || 'An unexpected server error occurred.'}`;
        if (error.message === "PERMISSION_DENIED") {
            description = "You do not have permission to update links.";
        } else if (error.message === "DEFAULT_LINK_UPDATE_FORBIDDEN") {
            description = "Default links cannot be modified.";
        } else if (error.message.includes("Database Error:")) {
             const codeMatch = error.message.match(/\(Code: (.*?)\)/);
             const code = codeMatch ? codeMatch[1] : 'unknown';
             description = `Failed to update link. Database error: ${code}`;
        } else if (error.message === "INVALID_LINK_ID") {
             description = "Internal error: Invalid link ID provided for update.";
        }
        toast({ title: "Error Updating Link", description: description, variant: "destructive" });
    },
  });

   // Mutation for deleting a link (only admin)
  const deleteLinkMutation = useMutation({
    mutationFn: (linkId: string) => {
        // **Crucial:** Double-check admin status *before* attempting delete
        if (!isAdmin) throw new Error("PERMISSION_DENIED");
        // Service function handles default link check
        return deleteAffiliateLink(linkId); // Call the service function
    },
    onSuccess: (data, linkId) => {
        queryClient.invalidateQueries({ queryKey: ['affiliateLinks'] }); // Invalidate cache
        toast({ title: "Success!", description: "Affiliate link deleted successfully." });
         if (editingLink?.id === linkId) {
             setEditingLink(null); // Clear editing state if the deleted link was being edited
         }
    },
    onError: (error: Error) => {
        console.error("Delete Link Mutation Error:", error); // More specific logging
        let description = `Failed to delete link: ${error.message || 'An unexpected server error occurred.'}`;
         if (error.message === "PERMISSION_DENIED") {
            description = "You do not have permission to delete links.";
        } else if (error.message === "DEFAULT_LINK_DELETE_FORBIDDEN") {
             description = "Default links cannot be deleted.";
        } else if (error.message.includes("Database Error:")) {
            const codeMatch = error.message.match(/\(Code: (.*?)\)/);
            const code = codeMatch ? codeMatch[1] : 'unknown';
            description = `Failed to delete link. Database error: ${code}`;
        }
        toast({ title: "Error Deleting Link", description: description, variant: "destructive" });
    },
  });

  // --- Handlers ---
  const handleLinkAdded = (newLinkData: Omit<AffiliateLink, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
     // Basic check if user is logged in, mutation itself handles more detailed errors
     if (!user) {
        toast({ title: "Action Required", description: "Please log in to add links.", variant: "destructive" });
        return;
     }
     addLinkMutation.mutate(newLinkData);
  };

  const handleLinkUpdated = (updatedLink: AffiliateLink) => {
     // Explicit admin check before calling the mutation
     if (!isAdmin) {
         toast({ title: "Permission Denied", description: "You do not have permission to update links.", variant: "destructive" });
         return;
     }
     // Let the mutation handle the specific check for default links
     updateLinkMutation.mutate(updatedLink);
  };

  const handleDeleteLink = (id: string) => {
     // Explicit admin check before calling the mutation
    if (!isAdmin) {
         toast({ title: "Permission Denied", description: "You do not have permission to delete links.", variant: "destructive" });
         return;
     }
     // Let the mutation handle the specific check for default links
    // Confirmation dialog is good practice here
    if (window.confirm("Are you sure you want to delete this link?")) {
        deleteLinkMutation.mutate(id);
    }
  };

  const handleEditLink = (link: AffiliateLink) => {
    // Only allow admin to initiate edit
    if (!isAdmin) {
        toast({ title: "Permission Denied", description: "You do not have permission to edit links.", variant: "destructive" });
        return;
    }
    // Prevent initiating edit for default links directly in the handler
     if (link.id?.startsWith('default-link-')) {
        toast({ title: "Action Not Allowed", description: "Default links cannot be edited.", variant: "destructive" });
        return; // Prevent editing default links
    }
    setEditingLink(link);
     // Scroll to the management form for better UX
    document.getElementById('link-management-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
    // Optionally scroll back up or provide other UX cues
  };


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
         <h1 className="text-2xl font-bold">AffiliateLink Hub</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Increased gap */}
         {/* Display Area */}
        <div>
          {linksLoading || authLoading ? (
             <div className="space-y-6">
                {/* Skeleton loaders match the card structure */}
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-24 w-24 rounded-md" />
                      <Skeleton className="h-10 w-24 ml-auto" />
                    </div>
                    {/* Conditional skeleton for admin buttons - assume admin might be true during loading */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                  </div>
                ))}
             </div>
           ) : linksError ? (
             // Display a user-friendly error message from the query
             <p className="text-destructive">Error loading links: {linksError.message}</p>
           ) : (
             <AffiliateLinkDisplay
              links={links}
              isAdmin={isAdmin} // Pass admin status
              onDelete={handleDeleteLink} // Pass delete handler (admin check happens inside)
              onEdit={handleEditLink} // Pass edit handler (admin check happens inside)
             />
           )}
        </div>

        {/* Management/AI Area */}
        <div className="space-y-6" id="link-management-section"> {/* Add ID for scrolling */}
          {authLoading && (
             <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
           )}
          {!authLoading && user && ( // Show management/AI tools if user is logged in
            <>
              <LinkManagement
                // Add/Edit form is always rendered for logged-in users,
                // edit initiation is controlled by handleEditLink,
                // submit logic controlled by mutations with admin checks.
                onLinkAdded={handleLinkAdded}
                onLinkUpdated={handleLinkUpdated}
                editingLink={editingLink} // Pass editingLink (null if not editing or not admin)
                onCancelEdit={handleCancelEdit}
                isAdmin={isAdmin} // Pass isAdmin for UI cues within the component if needed
                isSubmitting={addLinkMutation.isPending || updateLinkMutation.isPending} // Pass combined submitting state
              />
              <AiDescription />
            </>
          )}
           {!authLoading && !user && ( // Show a message for non-logged-in users
              <p className="text-muted-foreground text-center md:text-left mt-8">
                  Please log in to add affiliate links and generate descriptions.
              </p>
           )}
        </div>
      </div>
    </div>
  );
}
