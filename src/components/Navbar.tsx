// src/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, LogIn, UserPlus, LogOut, Accessibility } from 'lucide-react'; // Added Accessibility
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ModeToggle";
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import { Button } from "@/components/ui/button"; // Import Button
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Import Avatar


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth(); // Get auth state and signout function

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAccessibilityClick = () => {
    console.log("Accessibility options clicked");
    // Placeholder for future accessibility features/modal
    alert("Accessibility options coming soon!");
  };

  return (
    <nav className="bg-background border-b shadow-sm fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          AffiliateLink Hub
        </Link>

        {/* Hamburger menu for small devices */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 cursor-pointer" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetTitle>Navigation</SheetTitle>
              <div className="flex flex-col space-y-4 p-4">
                <Link href="/" className="hover:text-primary" onClick={handleMenuClose}>
                  Home
                </Link>
                <Link href="/about" className="hover:text-primary" onClick={handleMenuClose}>
                  About
                </Link>
                <Link href="/contact" className="hover:text-primary" onClick={handleMenuClose}>
                  Contact
                </Link>
                <Link href="/pricing" className="hover:text-primary" onClick={handleMenuClose}>
                  Pricing
                </Link>
                <Link href="/blog" className="hover:text-primary" onClick={handleMenuClose}>
                  Blog
                </Link>
                <div className="border-t my-2"></div>
                {loading ? (
                   <p>Loading...</p> // Show loading state
                ) : user ? (
                  <>
                    <div className="flex items-center space-x-2 mb-2">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                         <AvatarFallback>{getInitials(user.displayName || user.email)}</AvatarFallback> {/* Use email if no display name */}
                       </Avatar>
                       <span>{user.displayName || user.email}</span>
                    </div>
                    <Button variant="ghost" onClick={() => {signOut(); handleMenuClose();}} className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                   <>
                     <Link href="/login" passHref>
                        <Button variant="ghost" onClick={handleMenuClose} className="w-full justify-start">
                           <LogIn className="mr-2 h-4 w-4" /> Login
                        </Button>
                      </Link>
                     <Link href="/signup" passHref>
                       <Button variant="ghost" onClick={handleMenuClose} className="w-full justify-start">
                         <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                       </Button>
                     </Link>
                   </>
                )}
                <div className="flex items-center space-x-2 mt-auto pt-4 border-t">
                  <ModeToggle />
                  <Button variant="ghost" size="icon" onClick={() => { handleAccessibilityClick(); handleMenuClose(); }} aria-label="Accessibility Options">
                    <Accessibility className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Navigation links for medium and larger devices */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
          <Link href="/pricing" className="hover:text-primary">
            Pricing
          </Link>
           <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
           {loading ? (
             <div className="h-8 w-20 bg-muted rounded animate-pulse"></div> // Skeleton loader
           ) : user ? (
              <div className="flex items-center space-x-2">
                 <Avatar className="h-8 w-8">
                   <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback>{getInitials(user.displayName || user.email)}</AvatarFallback> {/* Use email if no display name */}
                 </Avatar>
                 <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="mr-1 h-4 w-4" /> Logout
                 </Button>
              </div>
           ) : (
             <div className="flex items-center space-x-2">
                <Link href="/login" passHref>
                  <Button variant="ghost" size="sm">
                    <LogIn className="mr-1 h-4 w-4" /> Login
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button variant="outline" size="sm">
                    <UserPlus className="mr-1 h-4 w-4" /> Sign Up
                  </Button>
                </Link>
             </div>
           )}
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={handleAccessibilityClick} aria-label="Accessibility Options">
            <Accessibility className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
