"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>About AffiliateLink Hub</CardTitle>
          <CardDescription>Learn more about our platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-md">
            AffiliateLink Hub is a platform designed to help you manage and promote your affiliate links.
            We provide tools to generate descriptions.
          </p>
          <section className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
            <p className="text-md">
              Our mission is to empower affiliate marketers with the resources they need to succeed.
              We aim to simplify the process of managing affiliate links.
            </p>
          </section>
          <section className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Key Features</h2>
            <ul className="list-disc pl-5">
              <li>AI-Powered Description Generation</li>
              <li>Centralized Link Management</li>
              <li>Easy Promotion Tools</li>
            </ul>
          </section>
          <section className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="text-md">
              If you have any questions or feedback, please don't hesitate to reach out through our <a href="/contact" className="text-primary">Contact Page</a>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
