
"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card"; // Added CardFooter import
import {useState} from 'react';

const PricingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planName: string, price: string) => {
    setLoading(true);
    // Placeholder: Implement your actual subscription logic here
    // This could involve calling an API endpoint to handle the subscription
    console.log(`Attempting to subscribe to ${planName} at ${price}`);
    alert(`Subscription feature for ${planName} coming soon!`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Pricing Plans</CardTitle>
          <CardDescription>Choose the plan that's right for you.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {/* Basic Plan */}
          <Card className="flex flex-col">
             <CardHeader>
                 <CardTitle>Basic Plan</CardTitle>
                 <CardDescription>Essential affiliate link management tools.</CardDescription>
             </CardHeader>
             <CardContent className="flex-grow">
                 <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                 <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5 mb-6">
                     <li>Manage up to 50 links</li>
                     <li>Basic Analytics</li>
                     <li>Email Support</li>
                 </ul>
             </CardContent>
             <CardFooter>
                 <Button
                    className="w-full"
                    disabled={loading}
                    onClick={() => handleSubscribe("Basic Plan", "$9.99/month")}
                 >
                    {loading ? "Processing..." : "Subscribe"}
                 </Button>
             </CardFooter>
          </Card>

           {/* Premium Plan */}
           <Card className="flex flex-col border-primary shadow-lg"> {/* Highlight premium */}
             <CardHeader>
                 <CardTitle>Premium Plan</CardTitle>
                 <CardDescription>Includes AI features and more links.</CardDescription>
                 <p className="text-xs font-semibold text-primary pt-1">MOST POPULAR</p>
             </CardHeader>
             <CardContent className="flex-grow">
                 <p className="text-3xl font-bold mb-4">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5 mb-6">
                     <li>Manage up to 250 links</li>
                     <li>Advanced Analytics</li>
                     <li>AI Description Generator</li>
                     <li>Priority Email Support</li>
                 </ul>
             </CardContent>
             <CardFooter>
                 <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" // Primary button style
                    disabled={loading}
                    onClick={() => handleSubscribe("Premium Plan", "$19.99/month")}
                 >
                    {loading ? "Processing..." : "Subscribe"}
                 </Button>
             </CardFooter>
          </Card>

           {/* Business Plan */}
           <Card className="flex flex-col">
             <CardHeader>
                 <CardTitle>Business Plan</CardTitle>
                 <CardDescription>For serious marketers and teams.</CardDescription>
             </CardHeader>
             <CardContent className="flex-grow">
                 <p className="text-3xl font-bold mb-4">$29.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                 <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5 mb-6">
                    <li>Unlimited Links</li>
                    <li>Advanced Analytics & Reports</li>
                    <li>AI Description Generator</li>
                    <li>Dedicated Phone Support</li>
                    <li>Team Access (up to 5 users)</li>
                 </ul>
             </CardContent>
             <CardFooter>
                 <Button
                     className="w-full"
                     disabled={loading}
                     onClick={() => handleSubscribe("Business Plan", "$29.99/month")}
                 >
                    {loading ? "Processing..." : "Subscribe"}
                 </Button>
             </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingPage;
