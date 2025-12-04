import * as stytch from "stytch";

let client: stytch.Client | null = null;

export function getStytchClient(): stytch.Client {
    if (!client) {
        client = new stytch.Client({
            project_id: process.env.STYTCH_PROJECT_ID || "",
            secret: process.env.STYTCH_SECRET || "",
        });
    }
    return client;
}

// Allowed email domain for Google OAuth
export const ALLOWED_EMAIL_DOMAIN = "@biggeo.com";

export function isEmailAllowed(email: string): boolean {
    return email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN);
}
