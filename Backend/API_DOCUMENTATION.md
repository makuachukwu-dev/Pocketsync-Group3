# API Documentation

This backend is a RESTful API returning JSON responses. Protected routes require active cookie-based session headers.

---

## Authentication Mechanism

Authentication is managed via `express-session`. 

1. **Session Cookie:** Upon successful login or registration, the server sends a session identifier in the `Set-Cookie` header: `connect.sid`.
2. **State Verification:** Subsequent requests must include this cookie to access protected endpoints.

---

## Endpoints

### 1. API Metadata
* **Route:** `GET /`
* **Auth Required:** No
* **Description:** Health check status and endpoint catalog map.
* **Success Response (200 OK):**
  ```json
  {
    "status": "healthy",
    "message": "Auth backend API is running successfully.",
    "endpoints": {
      "register": "POST /register",
      "login": "POST /login",
      "logout": "POST /logout",
      "me": "GET /me",
      "dashboard": "GET /dashboard",
      "googleAuth": "GET /auth/google",
      "googleAuthCallback": "GET /auth/google/callback",
      "appleAuth": "GET /auth/apple",
      "appleAuthCallback": "POST /auth/apple/callback",
      "forgotPassword": "POST /forgot-password",
      "resetPassword": "POST /reset-password"
    }
  }
  ```

---

### 2. User Registration
* **Route:** `POST /register`
* **Auth Required:** No
* **Content-Type:** `application/json`
* **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | `string` | Yes | Display name of the user |
  | `email` | `string` | Yes | Unique login email |
  | `password` | `string` | Yes | Secure password (plain text, will be hashed) |
* **Request Example:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "mySecurePassword123"
  }
  ```
* **Success Response (210 Created):**
  ```json
  {
    "message": "Registered successfully",
    "user": {
      "id": "user_1782485501243",
      "email": "jane@example.com",
      "name": "Jane Doe"
    }
  }
  ```
* **Error Responses:**
  * **400 Bad Request:** Missing fields.
    ```json
    { "error": "Name, email, and password are required" }
    ```
  * **409 Conflict:** User email already exists.
    ```json
    { "error": "User already exists" }
    ```

---

### 3. User Login
* **Route:** `POST /login`
* **Auth Required:** No
* **Content-Type:** `application/json`
* **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | `string` | Yes | User email |
  | `password` | `string` | Yes | User password |
* **Request Example:**
  ```json
  {
    "email": "jane@example.com",
    "password": "mySecurePassword123"
  }
  ```
* **Success Response (200 OK):**
  * Sets the session cookie (`connect.sid`).
  ```json
  {
    "message": "Logged in successfully",
    "user": {
      "id": "user_1782485501243",
      "email": "jane@example.com",
      "name": "Jane Doe"
    }
  }
  ```
* **Error Responses:**
  * **400 Bad Request:** Missing login parameters.
    ```json
    { "error": "Email and password are required" }
    ```
  * **401 Unauthorized:** Invalid password or email.
    ```json
    { "error": "Invalid credentials" }
    ```

---

### 4. Fetch Current User Details
* **Route:** `GET /me`
* **Auth Required:** Yes (Active session cookie)
* **Description:** Retrieve details of the currently authenticated session user.
* **Success Response (200 OK):**
  ```json
  {
    "user": {
      "id": "user_1782485501243",
      "email": "jane@example.com",
      "name": "Jane Doe"
    }
  }
  ```
* **Error Responses:**
  * **401 Unauthorized:** No valid session cookie found.
    ```json
    { "error": "Unauthorized" }
    ```

---

### 5. Fetch Dashboard Content
* **Route:** `GET /dashboard`
* **Auth Required:** Yes (Active session cookie)
* **Description:** Simple protected mock dashboard data.
* **Success Response (200 OK):**
  ```json
  {
    "message": "Authenticated",
    "user": {
      "id": "user_1782485501243",
      "email": "jane@example.com",
      "name": "Jane Doe"
    }
  }
  ```
* **Error Responses:**
  * **401 Unauthorized:** No valid session cookie.
    ```json
    { "error": "Unauthorized" }
    ```

---

### 6. User Logout
* **Route:** `POST /logout`
* **Auth Required:** No
* **Description:** Destroys the current session on the backend and clears credentials cache.
* **Success Response (200 OK):**
  ```json
  { "message": "Logged out" }
  ```

---

### 7. Google OAuth Sign-in Initiation
* **Route:** `GET /auth/google`
* **Auth Required:** No
* **Description:** Redirects the user's browser client to Google's OAuth 2.0 Consent Screen.
* **Error Responses:**
  * **503 Service Unavailable:** Google OAuth keys are missing in the server's `.env`.
    ```json
    { "error": "Google sign-in is not configured yet" }
    ```

---

### 8. Google OAuth Callback Redirect Handler
* **Route:** `GET /auth/google/callback`
* **Auth Required:** No
* **Description:** Google calls this redirect callback after authentication. If authorization succeeds, it automatically sets the session cookie and redirects the client to the `/dashboard` route.

---

### 9. Forgot Password (Request Reset Link)
* **Route:** `POST /forgot-password`
* **Auth Required:** No
* **Content-Type:** `application/json`
* **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | `string` | Yes | Registered email to send the reset link to |
* **Request Example:**
  ```json
  {
    "email": "jane@example.com"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "If an account with that email exists, a password reset link has been sent.",
    "testToken": "90fa05f089f2f1c08df5bd57242c469f9d735268"
  }
  ```
* **Error Responses:**
  * **400 Bad Request:** Missing fields.
    ```json
    { "error": "Email is required" }
    ```

---

### 10. Reset Password
* **Route:** `POST /reset-password`
* **Auth Required:** No
* **Content-Type:** `application/json`
* **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `token` | `string` | Yes | Token received in the reset email / response |
  | `password` | `string` | Yes | New password for the account |
* **Request Example:**
  ```json
  {
    "token": "90fa05f089f2f1c08df5bd57242c469f9d735268",
    "password": "myNewSecurePassword123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "Password has been reset successfully"
  }
  ```
* **Error Responses:**
  * **400 Bad Request:** Missing parameters or invalid/expired token.
    ```json
    { "error": "Token and password are required" }
    ```
    or
    ```json
    { "error": "Password reset token is invalid or has expired" }
    ```

---

### 11. Apple OAuth Sign-in Initiation
* **Route:** `GET /auth/apple`
* **Auth Required:** No
* **Description:** Redirects the user's browser client to Apple's OAuth 2.0 Consent Screen.
* **Error Responses:**
  * **503 Service Unavailable:** Apple OAuth keys are missing in the server's `.env`.
    ```json
    { "error": "Apple sign-in is not configured yet" }
    ```

---

### 12. Apple OAuth Callback Redirect Handler
* **Route:** `POST /auth/apple/callback`
* **Auth Required:** No
* **Description:** Apple calls this redirect callback (via HTTP `POST` form post) after authentication. If authorization succeeds, it automatically sets the session cookie and redirects the client to the `/dashboard` route.

