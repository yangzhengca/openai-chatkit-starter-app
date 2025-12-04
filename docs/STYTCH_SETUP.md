# Stytch Authentication Setup Guide

This guide walks you through setting up Stytch B2C authentication with Google OAuth, restricted to `@biggeo.com` email addresses only.

## Table of Contents

1. [Install Dependencies](#1-install-dependencies)
2. [Create Stytch Account](#2-create-stytch-account)
3. [Configure Google OAuth in Stytch](#3-configure-google-oauth-in-stytch)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Configure Stytch Redirect URLs](#5-configure-stytch-redirect-urls)
6. [Test the Integration](#6-test-the-integration)
7. [Production Deployment](#7-production-deployment)

---

## 1. Install Dependencies

Run the following command to install the Stytch Node.js SDK:

```bash
npm install stytch
```

---

## 2. Create Stytch Account

1. Go to [https://stytch.com](https://stytch.com)
2. Click **"Get started"** or **"Sign up"**
3. Create an account using your email
4. After signing up, you'll be directed to the Stytch Dashboard

---

## 3. Configure Google OAuth in Stytch

### 3.1 Enable Google OAuth in Stytch Dashboard

1. Log into the [Stytch Dashboard](https://stytch.com/dashboard)
2. Make sure you're in **Test** environment (toggle at top-left)
3. Navigate to **Authentication** → **OAuth** in the left sidebar
4. Click on **Google**
5. Toggle **Enable Google OAuth** to ON

### 3.2 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:

    - Choose **External** user type
    - Fill in app name: `BigGeo Marketplace Agent`
    - Fill in user support email
    - Add authorized domain: `biggeo.com`
    - Fill in developer contact email
    - Click **Save and Continue**
    - Skip Scopes (default is fine)
    - Add test users if in testing mode
    - Click **Save and Continue**

6. Back in Credentials, click **Create Credentials** → **OAuth client ID**
7. Select **Web application**
8. Name: `BigGeo Marketplace - Stytch`
9. Add **Authorized redirect URIs**:
    - For Stytch Test: `https://test.stytch.com/v1/oauth/google/callback`
    - For Stytch Live: `https://api.stytch.com/v1/oauth/google/callback`
10. Click **Create**
11. Copy the **Client ID** and **Client Secret**

### 3.3 Add Google Credentials to Stytch

1. Go back to Stytch Dashboard → **Authentication** → **OAuth** → **Google**
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

---

## 4. Configure Environment Variables

### 4.1 Get Stytch API Keys

1. In Stytch Dashboard, go to **API Keys** (left sidebar)
2. Copy your **Project ID** and **Secret** for the Test environment

### 4.2 Create `.env.local` File

Create a `.env.local` file in the project root with the following variables:

```env
# Existing variables
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=your_workflow_id

# Stytch Configuration
STYTCH_PROJECT_ID=project-test-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
STYTCH_SECRET=secret-test-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STYTCH_PUBLIC_TOKEN=public-token-test-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# App URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace the placeholder values with your actual credentials.

> **Important:** You can find all three Stytch values (Project ID, Secret, and Public Token) in the Stytch Dashboard under **API Keys**.

---

## 5. Configure Stytch Redirect URLs

### 5.1 Set Up Redirect URLs in Stytch

1. In Stytch Dashboard, go to **Configuration** → **Redirect URLs**
2. Add the following redirect URLs:

For **Development**:

```
http://localhost:3000/api/auth/callback
```

For **Production** (add later when deploying):

```
https://your-production-domain.com/api/auth/callback
```

3. Set the **Default login redirect URL** to: `http://localhost:3000/api/auth/callback`
4. Set the **Default signup redirect URL** to: `http://localhost:3000/api/auth/callback`

---

## 6. Test the Integration

### 6.1 Start the Development Server

```bash
npm run dev
```

### 6.2 Test Login Flow

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should be redirected to the login page
3. Click **"Sign in with Google"**
4. Sign in with a `@biggeo.com` Google account
5. You should be redirected back to the main app

### 6.3 Test Unauthorized Email

1. Try signing in with a non-`@biggeo.com` email
2. You should see an error message: "Only @biggeo.com emails are allowed to sign in."

---

## 7. Production Deployment

### 7.1 Switch to Stytch Live Environment

1. In Stytch Dashboard, toggle to **Live** environment
2. Go to **API Keys** and copy your Live **Project ID** and **Secret**
3. Add the live redirect URL in **Configuration** → **Redirect URLs**

### 7.2 Update Google OAuth for Production

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Click **Publish App** to move from Testing to Production
3. Update the authorized redirect URI to include Stytch Live:
    - `https://api.stytch.com/v1/oauth/google/callback`

### 7.3 Update Environment Variables for Production

Update your production environment variables:

```env
STYTCH_PROJECT_ID=project-live-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
STYTCH_SECRET=secret-live-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### 7.4 Deploy

Deploy your application to your hosting provider (Vercel, AWS, etc.) with the updated environment variables.

---

## Troubleshooting

### Common Issues

1. **"Missing STYTCH_PROJECT_ID or STYTCH_SECRET"**

    - Ensure your `.env.local` file has the correct values
    - Restart the development server after adding environment variables

2. **"OAuth redirect URI mismatch"**

    - Verify the redirect URL in Stytch Dashboard matches exactly: `http://localhost:3000/api/auth/callback`
    - Check Google Cloud Console authorized redirect URIs

3. **"Invalid token" on callback**

    - The token may have expired - try signing in again
    - Ensure you're using the correct Stytch environment (Test vs Live)

4. **User gets logged out immediately**
    - Check browser console for errors
    - Verify the session cookie is being set correctly

### Need Help?

-   [Stytch Documentation](https://stytch.com/docs)
-   [Stytch Google OAuth Guide](https://stytch.com/docs/guides/oauth/google)
-   [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)

---

## Files Created/Modified

### New Files

-   `lib/stytch.ts` - Stytch client configuration
-   `lib/auth.ts` - Session management utilities
-   `context/AuthContext.tsx` - React auth context provider
-   `middleware.ts` - Route protection middleware
-   `app/login/page.tsx` - Login page with Google OAuth button
-   `app/api/auth/google/route.ts` - Initiates Google OAuth flow
-   `app/api/auth/callback/route.ts` - Handles OAuth callback
-   `app/api/auth/me/route.ts` - Returns current user session
-   `app/api/auth/logout/route.ts` - Handles logout
-   `components/UserMenu.tsx` - User dropdown menu component

### Modified Files

-   `app/layout.tsx` - Added AuthProvider wrapper
-   `app/App.tsx` - Added auth state handling and UserMenu
