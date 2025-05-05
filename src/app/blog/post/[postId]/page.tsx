'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

interface PostPageProps {
  params: Promise<{
    postId: string;
  }>;
}

// Placeholder blog posts data
const blogPosts = [
  {
    id: 'best-tv-2024',
    categoryId: 'electronics',
    title: 'Best TVs of 2024',
    content: 'Here are the best TVs you can buy in 2024... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nunc. Sed euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nunc.',
    amazonLink: 'https://www.amazon.com/best-tv-2024',
  },
  {
    id: 'cozy-blankets',
    categoryId: 'home-goods',
    title: 'Top 5 Cozy Blankets for Winter',
    content: 'These are the coziest blankets to keep you warm... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nunc. Sed euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nunc.',
    amazonLink: 'https://www.amazon.com/cozy-blankets',
  },
  {
    id: 'must-read-novels',
    categoryId: 'books',
    title: 'Must-Read Novels of the Year',
    content: 'You need to read these novels this year... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nunc. Sed euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nunc.',
    amazonLink: 'https://www.amazon.com/must-read-novels',
  },
  {
    id: 'summer-fashion-trends',
    categoryId: 'fashion',
    title: 'Summer Fashion Trends You Need to Know',
    content: 'Stay trendy this summer with these fashion trends... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nunc. Sed euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nunc.',
    amazonLink: 'https://www.amazon.com/summer-fashion-trends',
  },
];

const PostPage: React.FC<PostPageProps> = ({ params: paramsPromise }) => {
  const params = React.use(paramsPromise); // Unwrap the promise
  const { postId } = params;
  const router = useRouter();

  // Find the blog post based on postId
  const post = blogPosts.find(post => post.id === postId);

  if (!post) {
    return (
      <div className="container mx-auto p-4">
        <Card>
            <CardHeader>
                <CardTitle>Post Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>The post you are looking for does not exist.</CardDescription>
                <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">
                    Go Back
                </button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-foreground">
            {post.content}
          </CardDescription>
          <a href={post.amazonLink} target="_blank" rel="noopener noreferrer" className="text-primary mt-4 inline-block hover:underline">
            Buy on Amazon
          </a>
        </CardContent>
      </Card>
        <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">
            Go Back
        </button>
    </div>
  );
};

export default PostPage;
