import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import AppleStrategy from "passport-apple";
import fs from "fs";
import jwt from "jsonwebtoken";
import { config } from "./config";
import { UserService } from "../services/user.service";
import { UserRecord } from "../types/auth.types";

export let googleAuthEnabled = false;
export let appleAuthEnabled = false;

export function configurePassport() {
  // 1. Configure Google OAuth Strategy
  const { clientId: googleClientId, clientSecret: googleClientSecret, callbackUrl: googleCallbackUrl } = config.google;

  if (!googleClientId || !googleClientSecret || !googleCallbackUrl) {
    console.warn("Google OAuth environment variables are missing; Google sign-in is disabled.");
  } else {
    googleAuthEnabled = true;
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL: googleCallbackUrl,
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
  }

  // 2. Configure Apple OAuth Strategy
  const { clientId: appleClientId, teamId, keyId, privateKey, callbackUrl: appleCallbackUrl } = config.apple;

  if (!appleClientId || !teamId || !keyId || !privateKey || !appleCallbackUrl) {
    console.warn("Apple OAuth environment variables are missing; Apple sign-in is disabled.");
  } else {
    appleAuthEnabled = true;

    let privateKeyString = privateKey;
    try {
      // If privateKey is a path to a key file, read the file. Otherwise, treat as key content.
      if (fs.existsSync(privateKey)) {
        privateKeyString = fs.readFileSync(privateKey, "utf8");
      }
    } catch (err) {
      console.warn("Failed checking/reading Apple private key path, assuming direct PEM string.");
    }

    passport.use(
      new AppleStrategy(
        {
          clientID: appleClientId,
          teamID: teamId,
          keyID: keyId,
          privateKeyString: privateKeyString,
          callbackURL: appleCallbackUrl,
          passReqToCallback: true,
        },
        (_req: any, _accessToken: string, _refreshToken: string, idToken: string, profile: any, done: any) => {
          let email = "";
          if (profile && profile.email) {
            email = profile.email;
          } else if (idToken) {
            try {
              const decoded = jwt.decode(idToken) as any;
              if (decoded && decoded.email) {
                email = decoded.email;
              }
            } catch (err) {
              console.error("Failed to decode Apple idToken JWT:", err);
            }
          }

          // Apple only returns user profile details (like name) on first authentication
          const appleUserId = (profile && profile.id) || (idToken ? (jwt.decode(idToken) as any)?.sub : null) || email;
          const existing = UserService.findByAppleIdOrEmail(appleUserId, email);

          if (existing) {
            const updated = UserService.updateUser(existing.id, {
              appleId: appleUserId,
              name: (profile && profile.name && `${profile.name.firstName} ${profile.name.lastName}`) || existing.name,
            });
            return done(null, updated ?? undefined);
          }

          const displayName = (profile && profile.name && `${profile.name.firstName} ${profile.name.lastName}`) || email.split("@")[0] || "Apple User";
          const newUser = UserService.createAppleUser(
            displayName,
            email,
            appleUserId
          );
          return done(null, newUser);
        }
      )
    );
  }

  // 3. User Serialization & Deserialization
  passport.serializeUser((user, done) => {
    done(null, (user as UserRecord).id);
  });

  passport.deserializeUser((id, done) => {
    const user = UserService.findById(id as string);
    done(null, user);
  });
}
