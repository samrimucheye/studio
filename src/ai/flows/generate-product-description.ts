'use server';
/**
 * @fileOverview Generates a product description based on the product name and keywords.
 *
 * - generateProductDescription - A function that generates the product description.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  keywords: z.string().describe('Keywords related to the product.'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('A short, engaging product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {
    schema: z.object({
      productName: z.string().describe('The name of the product.'),
      keywords: z.string().describe('Keywords related to the product.'),
    }),
  },
  output: {
    schema: z.object({
      description: z.string().describe('A short, engaging product description.'),
    }),
  },
  prompt: `You are an expert copywriter specializing in writing compelling product descriptions for affiliate marketing.

  Based on the product name and keywords provided, generate a short, engaging product description.

  Product Name: {{{productName}}}
  Keywords: {{{keywords}}}
  `,
});

const generateProductDescriptionFlow = ai.defineFlow<
  typeof GenerateProductDescriptionInputSchema,
  typeof GenerateProductDescriptionOutputSchema
>(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
