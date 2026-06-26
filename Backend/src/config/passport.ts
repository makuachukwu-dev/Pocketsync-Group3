import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config";
import { UserService } from "../services/user.service";
import { UserRecord } from "../types/auth.types";

export let googleAuthEnabled = false;

export function configurePassport() {
  const { clientId, clientSecret, callbackUrl } = config.google;

  if (!clientId || !clientSecret || !callbackUrl) {
    console.warn("Google OAuth environment variables are missing; Google sign-in is disabled.");
    return;
  }

  googleAuthEnabled = true;

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
      },
      (_accessToken, _refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value ?? "";
        const existing = UserService.findByGoogleIdOrEmail(profile.id, email);

        if (existing) {
          const updated = UserService.updateUser(existing.id, {
            googleId: profile.id,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
          });
          return done(null, updated ?? undefined);
        }

        const newUser = UserService.createOAuthUser(
          profile.displayName,
          email,
          profile.id,
          profile.photos?.[0]?.value
        );
        return done(null, newUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, (user as UserRecord).id);
  });

  passport.deserializeUser((id, done) => {
    const user = UserService.findById(id as string);
    done(null, user);
  });
}
