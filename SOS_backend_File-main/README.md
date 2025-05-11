
# 🚨 SOS Emergency Response Backend

This is the backend service for the **SOS Emergency Response System**, built using **Node.js**, **Express.js**, and **Supabase**. It powers emergency data processing, AI-based request validation, secure user authentication, and communication with the officials' dashboard.

---

## 🚀 Features

- 📤 **Image Upload API** – Uploads and stores emergency images for AI validation.
- 🧠 **AI Verification** – Integrates with a YOLOv8 model (external) to classify emergencies.
- 🔐 **Authentication** – Auth flow with Supabase Auth.
- 📍 **Geolocation API** – Stores and fetches user/emergency coordinates.
- 🔗 **Encrypted Database Sync** – Emergency data is AES-encrypted before being stored in Supabase.
- 👮 **Official Review System** – Officials fetch and decrypt reports via a secure dashboard.

---

## 📁 Project Structure

```
/routes/
  ├── fileUpload.ts       # Handles file/image uploads
  ├── requests.ts         # Emergency request logic
  ├── auth.ts             # Authentication routes
  └── locationsRouter.ts  # Location-based APIs

/config/
  └── supabase.ts         # Supabase client configuration

index.ts                 # Main Express app
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/sos-backend.git
cd sos-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
```

### 4. Start the server
```bash
npm run dev     # for development using ts-node
# or
npm run build && npm start   # for production
```

Server runs on: `http://localhost:5000`

---

## 🧪 API Endpoints

### `POST /upload`
Upload emergency-related image or video (handled by fileUploadRouter).

### `POST /auth`
Handles signup/login of users via Supabase.

### `POST /requests`
Accepts emergency requests, including media and metadata.

### `GET /locations`
Used by responders to receive real-time locations of emergencies.

---

## 🔐 AES Encryption Flow

- After an image is uploaded and verified via ML,
- The image is encrypted using AES encryption before being stored in the Supabase bucket.
- When fetched by authorized officials, the data is decrypted in real-time on the official dashboard.

---

## 🧑‍🚒 Admin (Official) Workflow

- Admins can view decrypted emergency requests.
- They can **accept** or **reject** based on AI + manual review.
- Only one responder can lock each request (no duplication).

---

## 📦 Built With

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [AES Encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Cookie-Parser](https://www.npmjs.com/package/cookie-parser)

---

## 🙋 Author

**Arpit Gupta**  
Feel free to reach out for collaboration or integration assistance.

---

## 📄 License

This project is licensed under the MIT License.
