'use client';

import {useState, useEffect} from 'react';
import {Button} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField, // Ensure FormField is imported
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Use Textarea for description
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {AffiliateLink} from "@/services/affiliate-link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext'; // Import useAuth

interface LinkManagementProps {
  onLinkAdded: (newLinkData: Omit<AffiliateLink, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onLinkUpdated: (updatedLink: AffiliateLink) => void; // Handler for updates
  editingLink: AffiliateLink | null; // Link being edited (only passed if admin)
  onCancelEdit: () => void; // Handler to cancel editing (only relevant for admin)
  isAdmin: boolean; // Receive isAdmin status
  isSubmitting: boolean; // Receive submitting status from parent mutations
}

// Use zodResolver for validation
const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageUrl: z.string().min(1, { message: "Image URL is required."}).url({
    message: "Image URL must be a valid URL.",
  }),
  affiliateUrl: z.string().min(1, { message: "Affiliate URL is required."}).url({
    message: "Affiliate URL must be a valid URL.",
  }),
})

// Infer the type from the schema
type LinkFormData = z.infer<typeof formSchema>;

const LinkManagement: React.FC<LinkManagementProps> = ({
  onLinkAdded,
  onLinkUpdated,
  editingLink, // Will be null if not admin or not editing
  onCancelEdit,
  isAdmin,
  isSubmitting // Destructure isSubmitting prop
}) => {
  const { user } = useAuth(); // Get user status
  // Determine if we are in admin edit mode.
  // editingLink should only be non-null if isAdmin is true (enforced by parent)
  const isEditing = !!editingLink;

  const form = useForm<LinkFormData>({
    resolver: zodResolver(formSchema),
    // Set initial default values
    defaultValues: {
      productName: "",
      description: "",
      imageUrl: "",
      affiliateUrl: "",
    },
  })

  // Populate form when editingLink changes and we are in edit mode
  useEffect(() => {
    if (isEditing && editingLink) {
      // Ensure all form fields exist in the editingLink or provide defaults
      const defaultValues: LinkFormData = {
        productName: editingLink.productName || "",
        description: editingLink.description || "",
        imageUrl: editingLink.imageUrl || "",
        affiliateUrl: editingLink.affiliateUrl || "",
      };
      form.reset(defaultValues); // Reset the form with the editing link's data
    } else {
        // Reset to blank if not editing (e.g., starting a new add or cancelling edit)
        form.reset({
            productName: "",
            description: "",
            imageUrl: "",
            affiliateUrl: "",
        });
    }
    // Only re-run the effect if editingLink or isEditing status changes
  }, [editingLink, isEditing, form]);


  function onSubmit(values: LinkFormData) {
    if (!user) {
        console.error("Attempted to submit form while not logged in.");
        return;
    }

    if (isEditing && editingLink) {
        // User is updating an existing link (isAdmin check is implicitly done by parent passing editingLink)
        onLinkUpdated({ ...editingLink, ...values }); // Call the update handler passed from parent
    } else {
       // User is adding a new link (any logged-in user can do this)
        onLinkAdded(values); // Call the add handler passed from parent
        form.reset(); // Reset form after successful add
    }
  }

  // Component should only be rendered if user is logged in (handled in page.tsx)
  if (!user) {
    return null;
  }


  return (
    // Add ID to the card for scrolling purposes
    <Card id="link-management-card" className="mb-4">
      <CardHeader>
        {/* Title changes based on edit state */}
        <CardTitle>{isEditing ? 'Edit Affiliate Link' : 'Add New Affiliate Link'}</CardTitle>
        <CardDescription>{isEditing ? 'Update the details for this affiliate link.' : 'Add a new affiliate link to promote products.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    {/* Disable input while submitting */}
                    <Input placeholder="Enter product name" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    The name of the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    {/* Disable input while submitting */}
                    <Textarea placeholder="Enter product description" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    A brief description of the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                     {/* Disable input while submitting */}
                    <Input placeholder="https://example.com/image.jpg" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    The URL of the product image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="affiliateUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliate URL</FormLabel>
                  <FormControl>
                    {/* Disable input while submitting */}
                    <Input placeholder="https://amazon.com/dp/..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    Your affiliate link for the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
                 {/* Button text changes based on edit state */}
                 <Button type="submit" disabled={isSubmitting}>
                   {/* Show appropriate loading text based on action and submission state */}
                   {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Link' : 'Add Link')}
                 </Button>
                 {/* Cancel button only shows during edit */}
                 {isEditing && (
                    <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isSubmitting}>
                     Cancel
                    </Button>
                 )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LinkManagement;
