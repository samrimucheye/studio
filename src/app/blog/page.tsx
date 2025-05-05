'use client';

import Link from 'next/link';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const blogCategories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Explore the latest in electronic gadgets and accessories.',
  },
  {
    id: 'home-goods',
    name: 'Home Goods',
    description: 'Discover essential and stylish items for your home.',
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Find your next great read in our diverse collection of books.',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Stay trendy with our curated selection of clothing and accessories.',
  },
];

const blogPosts = [
  {
    id: 'best-tv-2024',
    categoryId: 'electronics',
    title: 'Best TVs of 2024',
    shortDescription: 'Our top picks for the best televisions to buy this year.',
  },
  {
    id: 'cozy-blankets',
    categoryId: 'home-goods',
    title: 'Top 5 Cozy Blankets for Winter',
    shortDescription: 'Stay warm and comfortable with these amazing blankets.', // Fixed the unterminated string
  },
  {
    id: 'must-read-novels',
    categoryId: 'books',
    title: 'Must-Read Novels of the Year',
    shortDescription: 'Dive into these captivating novels that everyone is talking about.',
  },
  {
    id: 'summer-fashion-trends',
    categoryId: 'fashion',
    title: 'Summer Fashion Trends You Need to Know',
    shortDescription: 'Get ready for summer with the latest fashion trends.',
  },
];

const BlogPage = () => {
  return (
    <div className="container mx-auto p-4">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Explore Our Blog</h1>
        <p className="text-md">
          Welcome to our blog! Discover a variety of articles, tips, and recommendations
          across different categories.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogCategories.map(category => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/blog/category/${category.id}`} className="text-primary">
                  View Articles
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogPosts.map(post => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                {/* Ensure description is properly displayed */}
                <CardDescription>{post.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/blog/post/${post.id}`} className="text-primary">
                  Read More
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
