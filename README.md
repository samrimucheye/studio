# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Firebase and Google Generative AI API keys:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id (optional)

    GOOGLE_GENAI_API_KEY=your_google_generative_ai_api_key
    ```
    Replace `your_...` with your actual credentials.

3.  **Configure Firestore Security Rules:**
    In your Firebase project, go to Firestore Database &gt; Rules.
    Replace the default rules with the following to allow authenticated users to add links and admins to manage them:
    ```
    rules_version = '2';

    service cloud.firestore {
      match /databases/{database}/documents {
        // Affiliate Links Collection
        match /affiliateLinks/{linkId} {
          // Allow anyone to read affiliate links
          allow read: if true;

          // Allow any authenticated user to create new affiliate links.
          // The 'userId' field in the document must match the UID of the authenticated user.
          allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;

          // Allow updates and deletes ONLY if the link is NOT a default link
          // AND the requesting user is authenticated AND their email matches the admin email.
          // Replace 'samrimucheye@gmail.com' with your actual admin email.
          allow update, delete: if resource.id.startsWith('default-link-') == false &&
                                request.auth != null && request.auth.token.email == 'samrimucheye@gmail.com';

          // If you prefer to use custom claims for admin status (e.g., an 'admin' boolean claim):
          // allow update, delete: if resource.id.startsWith('default-link-') == false &&
          //                         request.auth != null && request.auth.token.admin == true;
        }

        // Default rules for other collections (if any)
        // match /{document=**} {
        //   allow read, write: if false; // Or your specific rules
        // }
      }
    }
    ```
    **Important:** Ensure the admin email in the rules (`'samrimucheye@gmail.com'`) matches the one defined in `src/context/AuthContext.tsx`.

4.  **Run the development server for Next.js:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be available at `http://localhost:9002`.

5.  **(Optional) Run Genkit development server (for testing flows directly):**
    In a separate terminal:
    ```bash
    npm run genkit:dev
    # or
    yarn genkit:dev
    # or
    pnpm genkit:dev
    ```

## Deploying to Netlify

When deploying this application to Netlify, you **must** configure the following environment variables in your Netlify site settings:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`
*   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (if you use it)
*   `GOOGLE_GENAI_API_KEY`

**Failure to set these environment variables on Netlify will result in errors when trying to interact with Firebase (e.g., adding links, authentication) or Genkit (e.g., generating descriptions).**

You can set these variables in your Netlify site dashboard under "Site settings" > "Build & deploy" > "Environment".
Ensure your Firestore security rules (see step 3 of "Running Locally") are also correctly set in your Firebase project for the deployed application to function as expected.
