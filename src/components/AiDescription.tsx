
"use client";

import {useState} from 'react';
import {Button} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateProductDescription } from "@/ai/flows/generate-product-description";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast"
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  keywords: z.string().min(3, {
    message: "Keywords must be at least 3 characters.",
  }),
})

// This component is available to any logged-in user.
const AiDescription: React.FC = () => {
  const { user } = useAuth(); // Get user status to ensure user is logged in
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      keywords: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
     if (!user) {
        toast({ title: "Error", description: "You must be logged in to generate descriptions.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    setDescription(''); // Clear previous description or error
    try {
      const aiResult = await generateProductDescription({
        productName: values.productName,
        keywords: values.keywords,
      });
      setDescription(aiResult.description);
    } catch (error: any) {
      console.error("AI Description Generation Error:", error);
      let errorMessage = "Failed to generate description. Please try again.";
      // Check if the error message indicates a service unavailable issue
      if (error.message && error.message.includes('503 Service Unavailable')) {
        errorMessage = "The AI service is currently overloaded. Please try again later.";
      } else if (error.message) {
         errorMessage = `Failed to generate description: ${error.message}`;
      }
       toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
       });
      setDescription(''); // Ensure description area is cleared on error
    } finally {
      setIsLoading(false);
    }
  }

   // Component rendering is controlled by the parent (page.tsx)
   // based on user login status.
  if (!user) {
      return null; // Don't render if not logged in
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>AI-Powered Description Generator</CardTitle>
        <CardDescription>Generate engaging product descriptions with AI.</CardDescription>
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
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the product for description generation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter keywords related to the product" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a few keywords that describe the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Description'}
            </Button>
          </form>
        </Form>
        {description && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Generated Description</h3>
            <Textarea value={description} readOnly className="mt-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiDescription;
