'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import {AffiliateLink} from "@/services/affiliate-link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

// Placeholder blog posts data
const blogPosts = [
  {
    id: 'best-tv-2024',
    categoryId: 'electronics',
    title: 'Best TVs of 2024',
    shortDescription: 'Our top picks for the best televisions to buy this year.',
    amazonLink: 'https://www.amazon.com/best-tv-2024', // Replace with actual Amazon link
  },
  {
    id: 'cozy-blankets',
    categoryId: 'home-goods',
    title: 'Top 5 Cozy Blankets for Winter',
    shortDescription: 'Stay warm and comfortable with these amazing blankets.',
    amazonLink: 'https://www.amazon.com/cozy-blankets', // Replace with actual Amazon link
  },
  {
    id: 'must-read-novels',
    categoryId: 'books',
    title: 'Must-Read Novels of the Year',
    shortDescription: 'Dive into these captivating novels that everyone is talking about.',
    amazonLink: 'https://www.amazon.com/must-read-novels', // Replace with actual Amazon link
  },
  {
    id: 'summer-fashion-trends',
    categoryId: 'fashion',
    title: 'Summer Fashion Trends You Need to Know',
    shortDescription: 'Get ready for summer with the latest fashion trends.',
    amazonLink: 'https://www.amazon.com/summer-fashion-trends', // Replace with actual Amazon link
  },
];


const CategoryPage: React.FC<CategoryPageProps> = ({ params: paramsPromise }) => {
  const params = React.use(paramsPromise); // Unwrap the promise
  const { categoryId } = params;
  const router = useRouter();

  // Filter blog posts based on categoryId
  const categoryPosts = blogPosts.filter(post => post.categoryId === categoryId);

  if (!categoryPosts.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Category: {categoryId}</h1>
        <p>No posts found in this category.</p>
        <button onClick={() => router.back()} className="text-primary hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Category: {categoryId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryPosts.map(post => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <a href={post.amazonLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                View on Amazon
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">
        Go Back
      </button>
    </div>
  );
};

export default CategoryPage;
