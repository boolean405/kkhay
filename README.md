# KKhay API

A secure and feature-rich RESTful API for managing user accounts, built using **Node.js**, **Express.js**, and **MongoDB**.

---

## 🌐 Live API

**Base URL:**  
[https://kkhay.onrender.com](https://kkhay.onrender.com)

- User Routes: `/api/user`
- Static Images: `/image`

---

## ✨ Email Verification

- On **signup**, users receive a verification email.
- The email contains a **token** valid for **10 minutes**.
- Users must verify their email before the account is created.
- Helps prevent spam and fake registrations.

---

## 📌 User API Endpoints (`/api/user`)

| Method | Endpoint           | Description                              | Auth Required |
| ------ | ------------------ | ---------------------------------------- | ------------- |
| POST   | `/signup`          | Send verification email                  | ❌ No         |
| POST   | `/verify`          | Verify email and create user account     | ❌ No         |
| POST   | `/signin`          | Log in and receive access/refresh tokens | ❌ No         |
| POST   | `/signout`         | Log out and clear refresh token cookie   | ✅ Yes        |
| GET    | `/refresh`         | Refresh access token using refresh token | ✅ Yes        |
| GET    | `/`                | Get current user profile                 | ✅ Yes        |
| PATCH  | `/changename`      | Change full name                         | ✅ Yes        |
| PATCH  | `/changeusername`  | Change username                          | ✅ Yes        |
| PATCH  | `/changepassword`  | Change password                          | ✅ Yes        |
| DELETE | `/deleteaccount`   | Permanently delete user account          | ✅ Yes        |
| GET    | `/picture/:userId` | Get user profile picture by ID           | ❌ No         |
| GET    | `/picture`         | Get current user's profile picture       | ✅ Yes        |
| POST   | `/picture`         | Upload or update profile picture         | ✅ Yes        |

---

## 🖼️ Static Image Routes (`/image`)

These serve images used for branding or UI:

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/image/logo`     | Logo image           |
| GET    | `/image/verified` | Verified badge image |

---

## 🛠️ Features

- ✅ **Email verification** before account creation
- 🔐 **JWT authentication** using access & refresh tokens
- 🍪 **Cookie-based refresh token** for secure session renewal
- 🔑 **Secure password hashing** with `bcrypt`
- 🧼 **Data validation** using `Joi` for all inputs
- 🖼️ **Profile picture upload** with `express-fileupload`
- 🧾 **Get/Update profile image** for authenticated users
- 🧹 **Full Account CRUD** (signup, login, update, delete)
- 🌐 **CORS** configuration with credentials support
- 📛 **Rate limiting** to protect against abuse (100 reqs/10 min)
- 🧱 **Custom middlewares**:
  - Request method logging
  - Error handler
  - Not found handler
  - Token/cookie validation
- 📦 **Organized MVC structure** with clean route separation

---

## 🧱 Tech Stack

- **Node.js** – Runtime for building server-side apps
- **Express.js** – Web framework for REST APIs
- **MongoDB + Mongoose** – NoSQL database and object modeling
- **JWT (JSON Web Tokens)** – Stateless access & refresh tokens
- **Nodemailer** – Email service for sending verification emails
- **bcrypt** – Password hashing and salting
- **Joi** – Schema validation for requests
- **dotenv** – Manage environment variables
- **express-fileupload** – Handle multipart form file uploads
- **cookie-parser** – Parse secure cookies
- **cors** – Cross-Origin Resource Sharing config

---

## 🛡️ Rate Limiting

The API is protected from abuse via rate limiting:

- **Limit:** 100 requests per IP
- **Window:** 10 minutes

If the limit is exceeded:

```json
{
  "status": false,
  "message": "Too many requests, please try again later!"
}
```
