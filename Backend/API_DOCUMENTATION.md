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

---

### 13. Verify KYC (BVN/NIN Gate)
* **Route:** `POST /kyc/verify`
* **Auth Required:** Yes (Active session cookie)
* **Content-Type:** `application/json`
* **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `bvn` | `string` | No* | 11-digit Bank Verification Number |
  | `nin` | `string` | No* | 11-digit National Identification Number |
  *\*Note: At least one of `bvn` or `nin` must be provided.*
* **Request Example:**
  ```json
  {
    "bvn": "12345678901"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "KYC verification successful",
    "user": {
      "id": "user_1782482842329",
      "email": "chinedu_test@example.com",
      "name": "Chinedu",
      "kycStatus": "verified"
    }
  }
  ```
* **Error Responses:**
  * **400 Bad Request:** Missing/invalid digit length.
    ```json
    { "error": "BVN or NIN is required for verification" }
    ```
    or
    ```json
    { "error": "BVN must be exactly 11 digits" }
    ```

---

### 14. Fetch Supported Institutions
* **Route:** `GET /institutions`
* **Auth Required:** Yes (Active session cookie)
* **Description:** Retrieve a list of supported banks/fintechs available for account aggregation.
* **Success Response (200 OK):**
  ```json
  {
    "institutions": [
      { "id": "gtbank", "name": "GTBank", "logo": "gtbank-logo" },
      { "id": "access", "name": "Access Bank", "logo": "access-logo" },
      { "id": "kuda", "name": "Kuda", "logo": "kuda-logo" },
      { "id": "opay", "name": "Opay", "logo": "opay-logo" },
      { "id": "moniepoint", "name": "Moniepoint", "logo": "moniepoint-logo" }
    ]
  }
  ```

---

### 15. Fetch Dashboard Aggregation Summary
* **Route:** `GET /dashboard`
* **Auth Required:** Yes (Active session cookie)
* **Description:** Retrieve consolidated net worth and details of connected bank accounts.
* **Success Response (200 OK):**
  ```json
  {
    "totalBalance": 2426108,
    "accountsCount": 2,
    "accounts": [
      {
        "id": "acc_1782482842458_291",
        "userId": "user_1782482842329",
        "institutionId": "gtbank",
        "institutionName": "GTBank",
        "accountNumber": "1284317152",
        "accountName": "Personal Savings",
        "balance": 1174607,
        "lastUpdated": "2026-06-26T14:07:22.458Z"
      },
      {
        "id": "acc_1782482842468_951",
        "userId": "user_1782482842329",
        "institutionId": "kuda",
        "institutionName": "Kuda",
        "accountNumber": "7032388025",
        "accountName": "Business Wallet",
        "balance": 1251501,
        "lastUpdated": "2026-06-26T14:07:22.468Z"
      }
    ]
  }
  ```

---

### 16. Connect/Link Bank Account
* **Route:** `POST /accounts/connect`
* **Auth Required:** Yes (Active session cookie AND Verified KYC)
* **Content-Type:** `application/json`
* **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `institutionId` | `string` | Yes | Bank ID slug (e.g. `gtbank`) |
  | `username` | `string` | Yes | Portal mock authentication username |
  | `password` | `string` | Yes | Portal mock authentication password |
  | `agreedToConsent` | `boolean` | Yes | Confirms permissions agreement (must be `true`) |
* **Request Example:**
  ```json
  {
    "institutionId": "gtbank",
    "username": "chinedu123",
    "password": "password123",
    "agreedToConsent": true
  }
  ```
* **Success Response (210 Created):**
  ```json
  {
    "message": "Account connected successfully",
    "account": {
      "id": "acc_1782482842458_291",
      "userId": "user_1782482842329",
      "institutionId": "gtbank",
      "institutionName": "GTBank",
      "accountNumber": "1284317152",
      "accountName": "Personal Savings",
      "balance": 1174607,
      "lastUpdated": "2026-06-26T14:07:22.458Z"
    }
  }
  ```
* **Error Responses:**
  * **400 Bad Request:** Missing fields, missing consent, or account already linked.
    ```json
    { "error": "Institution, username, and password are required" }
    ```
    or
    ```json
    { "error": "You have already connected your GTBank account." }
    ```
  * **403 Forbidden:** User is not KYC-verified.
    ```json
    { "error": "KYC verification required before linking accounts" }
    ```

---

### 17. Refresh Account Balance
* **Route:** `POST /accounts/:accountId/refresh`
* **Auth Required:** Yes (Active session cookie AND Verified KYC)
* **Description:** Triggers mock account balance updates (varies mock balances slightly to simulate background feed updates).
* **Success Response (200 OK):**
  ```json
  {
    "message": "Account refreshed successfully",
    "account": {
      "id": "acc_1782482842458_291",
      "userId": "user_1782482842329",
      "institutionId": "gtbank",
      "institutionName": "GTBank",
      "accountNumber": "1284317152",
      "accountName": "Personal Savings",
      "balance": 1215840,
      "lastUpdated": "2026-06-26T14:10:02.124Z"
    }
  }
  ```

---

### 18. Disconnect Account
* **Route:** `DELETE /accounts/:accountId`
* **Auth Required:** Yes (Active session cookie AND Verified KYC)
* **Description:** Disconnects/unlinks the specified bank account.
* **Success Response (200 OK):**
  ```json
  {
    "message": "Account disconnected successfully"
  }
  ```


