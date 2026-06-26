import express from "express";
import session from "express-session";
import passport from "passport";
import { config } from "./config/config";
import { configurePassport } from "./config/passport";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use("/", routes);

export default app;
