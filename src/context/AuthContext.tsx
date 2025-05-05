// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // auth might be null if initialization failed
import { z } from 'zod';
import { toast } from '@/hooks/use-toast'; // Use toast for notifications

// Define schemas for login and signup forms
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password should be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});
export type SignupFormData = z.infer<typeof signupSchema>;


interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUpWithEmailPassword: (data: SignupFormData) => Promise<void>;
  signInWithEmailPassword: (data: LoginFormData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'samrimucheye@gmail.com'; // Define admin email directly

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Only set up the listener if auth was initialized correctly
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
        // Check if the logged-in user's email matches the admin email
        setIsAdmin(!!user && user.email === ADMIN_EMAIL);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      // If auth is null, set loading to false and proceed without authentication
      setLoading(false);
      console.warn("Firebase Auth is not initialized. Authentication features will be disabled.");
    }
  }, []);

  const handleAuthError = (error: any, context: string) => {
    const authError = error as AuthError;
    let title = "Authentication Error";
    let description = "An unexpected error occurred. Please try again.";

    console.error(`Error during ${context}:`, authError.code, authError.message);

    switch (authError.code) {
        case 'auth/email-already-in-use':
            title = "Sign Up Failed";
            description = "This email address is already in use.";
            break;
        case 'auth/invalid-email':
            title = "Invalid Email";
            description = "Please enter a valid email address.";
            break;
        case 'auth/weak-password':
            title = "Weak Password";
            description = "Password should be at least 6 characters.";
            break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential': // Added for newer Firebase versions
            title = "Login Failed";
            description = "Incorrect email or password.";
            break;
        case 'auth/network-request-failed':
            title = "Network Error";
            description = "Could not connect to the authentication service. Please check your internet connection and try again.";
            break;
         case 'auth/too-many-requests':
            title = "Too Many Attempts";
            description = "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
            break;
        // Add other specific error codes as needed
        default:
            // Use the generic message for other errors
            break;
    }

     toast({
        title: title,
        description: description,
        variant: "destructive",
     });
  }

  const signUpWithEmailPassword = async (data: SignupFormData) => {
    if (!auth) {
      console.error("Firebase Auth is not initialized. Cannot sign up.");
      toast({ title: "Error", description: "Authentication service is unavailable.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      // User state will be updated by onAuthStateChanged listener
       toast({ title: "Success", description: "Account created successfully! You are now logged in." });
    } catch (error) {
        handleAuthError(error, "sign up");
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailPassword = async (data: LoginFormData) => {
     if (!auth) {
      console.error("Firebase Auth is not initialized. Cannot sign in.");
      toast({ title: "Error", description: "Authentication service is unavailable.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // User state will be updated by onAuthStateChanged listener
      toast({ title: "Success", description: "Logged in successfully!" });
    } catch (error) {
        handleAuthError(error, "sign in");
    } finally {
      setLoading(false);
    }
  };


  const signOut = async () => {
     if (!auth) {
      console.error("Firebase Auth is not initialized. Cannot sign out.");
      return;
    }
    try {
      await firebaseSignOut(auth);
       toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error signing out: ", authError.code, authError.message);
      // Handle error appropriately in UI
       toast({ title: "Error", description: `Sign out failed: ${authError.message}`, variant: "destructive" });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signUpWithEmailPassword, signInWithEmailPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
