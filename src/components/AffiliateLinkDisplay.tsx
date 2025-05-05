'use client';

import {AffiliateLink} from '@/services/affiliate-link';
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image'; // Use next/image for optimization
import { Pencil, Trash2 } from 'lucide-react'; // Import icons

interface AffiliateLinkDisplayProps {
  links: AffiliateLink[];
  isAdmin: boolean; // Receive isAdmin status to conditionally show buttons
  onDelete: (id: string) => void; // Handler for delete (triggered only if admin)
  onEdit: (link: AffiliateLink) => void; // Handler for edit (triggered only if admin)
}

const AffiliateLinkDisplay: React.FC<AffiliateLinkDisplayProps> = ({ links, isAdmin, onDelete, onEdit }) => {

  const handlePromoteClick = (affiliateUrl: string) => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer'); // Added security attributes
  };

  // Helper to determine AI hint based on default ID or product name
  const getAiHint = (link: AffiliateLink): string | undefined => {
    if (link.id === 'default-link-1') return 'laptop computer';
    if (link.id === 'default-link-2') return 'headphones audio';
    if (link.id === 'default-link-3') return 'office chair furniture';
    // Add more specific hints based on product name if needed for non-default items
    if (link.productName.toLowerCase().includes('laptop')) return 'laptop computer';
    if (link.productName.toLowerCase().includes('headphone')) return 'headphones audio';
    if (link.productName.toLowerCase().includes('chair')) return 'office chair furniture';
    return undefined; // No specific hint otherwise
  };


  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-4">Available Affiliate Links</h2> {/* Increased bottom margin */}
      {links.length === 0 ? (
        <p className="text-muted-foreground">No affiliate links available yet.</p>
      ) : (
        <div className="grid gap-6"> {/* Increased gap */}
          {links.map((link) => {
            const aiHint = getAiHint(link);
            const isDefaultLink = link.id?.startsWith('default-link-'); // Check if it's a default link

            return (
            <Card key={link.id} className="hover:shadow-lg transition-shadow duration-200 flex flex-col"> {/* Ensure cards grow */}
              <CardHeader>
                <CardTitle>{link.productName}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                 <div className="flex-shrink-0"> {/* Wrap Image to prevent shrinking */}
                   <Image
                      src={link.imageUrl}
                      alt={link.productName}
                      width={100} // Specify width
                      height={100} // Specify height
                      className="w-24 h-24 object-cover rounded-md" // Use rounded-md for consistency
                      data-ai-hint={aiHint} // Add AI hint here
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/100/100?random=placeholder'; }} // Basic fallback
                   />
                 </div>
                <div className="flex-grow"> {/* Allow text content to take space */}
                   {/* Content can go here if needed */}
                </div>
                 <Button
                    onClick={() => handlePromoteClick(link.affiliateUrl)}
                    className="mt-2 sm:mt-0 bg-primary hover:bg-primary/90 text-primary-foreground self-center sm:self-auto" // Adjust self alignment
                    aria-label={`Promote ${link.productName}`}
                  >
                    Promote Now
                  </Button>
              </CardContent>
              {/* Conditionally render Edit and Delete buttons */}
              {/* Show only if isAdmin is true AND it's not a default link */}
              {isAdmin && !isDefaultLink && (
                 <CardFooter className="flex justify-end space-x-2 pt-4 border-t mt-auto"> {/* Add border-top and push to bottom */}
                   <Button
                     variant="outline"
                     size="icon"
                     onClick={() => onEdit(link)}
                     aria-label={`Edit ${link.productName}`}
                     title="Edit Link" // Add title for better accessibility
                   >
                     <Pencil className="h-4 w-4" />
                   </Button>
                   <Button
                     variant="destructive"
                     size="icon"
                     onClick={() => onDelete(link.id)}
                     aria-label={`Delete ${link.productName}`}
                      title="Delete Link" // Add title for better accessibility
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </CardFooter>
              )}
            </Card>
           );
          })}
        </div>
      )}
    </div>
  );
};

export default AffiliateLinkDisplay;
