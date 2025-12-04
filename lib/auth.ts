import { cookies } from "next/headers";
import { getStytchClient, isEmailAllowed } from "./stytch";

export const SESSION_COOKIE_NAME = "stytch_session";
export const SESSION_DURATION_MINUTES = 60 * 24 * 7; // 7 days

export interface User {
    id: string;
    email: string;
    name?: string;
}

export async function getSession(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
        return null;
    }

    try {
        const stytchClient = getStytchClient();
        const response = await stytchClient.sessions.authenticate({
            session_token: sessionToken,
        });

        const email = response.user.emails[0]?.email;

        if (!email || !isEmailAllowed(email)) {
            // Revoke session if email is not allowed
            await stytchClient.sessions.revoke({ session_token: sessionToken });
            return null;
        }

        return {
            id: response.user.user_id,
            email: email,
            name: response.user.name?.first_name
                ? `${response.user.name.first_name} ${
                      response.user.name.last_name || ""
                  }`.trim()
                : undefined,
        };
    } catch (error) {
        console.error("Session authentication failed:", error);
        return null;
    }
}

export async function setSessionCookie(sessionToken: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_DURATION_MINUTES * 60,
        path: "/",
    });
}

export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
