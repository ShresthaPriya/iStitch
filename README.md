# 🧵 iStitch

**iStitch** is an online tailoring web app that digitizes the tailoring process to improve service quality, record-keeping, and customer management. It offers features like garment customization, order tracking, payment integration, and more. The app is built with **React.js**, **Node.js**, **Express**, and **MongoDB**.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
- [User Roles](#user-roles)
- [License](#license)

---

## 🌐 Overview

iStitch aims to modernize the traditional tailoring industry by allowing users to place orders, customize garments, track statuses, and manage tailoring businesses digitally. This promotes a paperless, efficient, and scalable system.

---

## ✨ Features

### 🧑‍💼 Authentication & Authorization
- Secure login/signup for Customers and Tailors/Admins.
- Google OAuth integration for easier sign-in.

### 👚 Product Management
- Tailors can add, update, and delete garments.
- Customers can view and purchase available garments.

### 🔍 Search & Filter
- Search garments and fabrics.
- Filter by category and price.

### 🛒 Cart Management
- Add/remove garments to/from cart.
- Update quantity within the cart.

### 🎨 Customization
- Select fabric, style, and type of clothing.
- Preview custom combinations before placing an order.

### 📦 Order Management
- Customers can track orders.
- Tailors can manage and update order statuses.

### 💰 Payment Integration
- Pay via **Khalti Wallet**.

### 🧵 Fabric & Category Management
- Tailors manage fabric options and categories (Men/Women).
- Customers explore fabrics before customizing.

### 📏 Measurements
- Customers can add/edit body measurements.
- Includes a video guide for proper measurement.

### 🖼 Image Upload
- Tailors can upload garment and fabric images.

### 🔔 Notifications
- Customers and tailors get notified about order placement and status updates.

### 👤 Profile Management
- Customers can edit profiles and change passwords.

---

## 🧰 Technologies Used

### 🔹 Frontend
- **React.js** – UI Development
- **Axios** – HTTP requests
- **React Router** – Routing
- **CSS** – Styling

### 🔹 Backend
- **Node.js** – Runtime
- **Express.js** – Server/API
- **Multer** – File uploads
- **JWT** – Authentication
- **Bcryptjs** – Password hashing
- **Passport.js** + **Google OAuth 2.0** – Social login
- **Nodemailer** – Email notifications

### 🔹 Database
- **MongoDB** – NoSQL database
- **Mongoose** – Schema modeling

---

## ⚙️ Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ShresthaPriya/iStitch.git
cd iStitch
```
## For the frontend
cd frontend
npx create-react-app istitch
npm install

# For the backend
cd ../Backend
npm install


3. **Environment Variables**: Create a `.env` file in the `server` directory with the following configuration:
    ```bash
    PORT=4000
    JWT_SECRET=Priya123
    SESSION_SECRET=2fbe9cd9c93c03d3bce158b9a7f3ac89216eaa039ad5e92f479fdad32d1a8a
    GOOGLE_CLIENT_ID=1031223916761-jugeevk80gl23se9obj1cd6p9daknb7i.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=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
    GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
    CLIENT_URL=http://localhost:3000
    MONGO_URI=mongodb+srv://np03cs4a220148:W6RUIOclhkR2gWAs@cluster0.lfrhba5.mongodb.net/iStitch_Tailor?retryWrites=true&w=majority&appName=Cluster0
    EMAIL_USER=your_email
    EMAIL_PASSWORD=ksfa cpkg ttxi iffp
    ADMIN_EMAIL=your_email
    ADMIN_PASSWORD=admin@123

    ```

4. **Start the server**:
    ```bash
    cd isitich/backend
    nodemon server.js
    ```

5. **Start the client**:
    ```bash
    cd istich/frontend
    npm start
    ```


  ### Screenshots

1. **Customer**
   
![image](https://github.com/user-attachments/assets/1c827b24-db27-4f94-babb-b59e91cb8fa7)

![image](https://github.com/user-attachments/assets/bdd5a7a0-2e67-45f0-9c3f-32c6f68160cc)


![image](https://github.com/user-attachments/assets/33e3343d-5586-4828-b6c0-5707316dade0)

![image](https://github.com/user-attachments/assets/5529deac-db29-4397-95db-cfaa2d6d996b)

![image](https://github.com/user-attachments/assets/d4bedced-c82d-42f3-a9ae-4cd04e0fe547)

![image](https://github.com/user-attachments/assets/a5d8a50f-da2f-4954-99a6-fbcfbc82c192)

![image](https://github.com/user-attachments/assets/8659410b-c65a-4021-b1c3-eb36d908630f)

![image](https://github.com/user-attachments/assets/87e5cd74-257e-4165-a212-7c55ef28c2f3)

![image](https://github.com/user-attachments/assets/ac4bb5ab-abe5-4d41-bf82-c36b45743baf)

![image](https://github.com/user-attachments/assets/1e409d37-b677-4aa4-aeab-a0679052677c)


![screencapture-localhost-3000-customer-measurements-2025-05-30-18_56_12](https://github.com/user-attachments/assets/4d76c4a1-9cb6-4d92-9c3d-5eb966859330)


![screencapture-localhost-3000-fabric-collection-2025-05-30-18_57_42](https://github.com/user-attachments/assets/2346b3f6-ff38-4bb9-859e-89bd6a04ef21)


![screencapture-localhost-3000-customize-dress-2025-05-30-18_59_17](https://github.com/user-attachments/assets/e55c4d74-24ea-477c-93ac-3fd087c195f3)

![screencapture-localhost-3000-review-order-2025-05-30-19_00_07](https://github.com/user-attachments/assets/f03d1ade-18f6-4470-a601-c6295965d4b4)


![screencapture-localhost-3000-women-2025-05-30-19_01_20](https://github.com/user-attachments/assets/c8f5b3e3-39ca-4562-8a0a-e9544c0696ea)

![image](https://github.com/user-attachments/assets/daef517f-2fab-4612-ac56-807525132cc9)

![image](https://github.com/user-attachments/assets/251b9eb1-8cd5-4bc3-a287-5dadad514c0c)

![image](https://github.com/user-attachments/assets/e83626da-aa18-4862-ab10-43cb008b06bf)

2. **Tailor/Admin**

![image](https://github.com/user-attachments/assets/5ad5b1e5-1d0a-4fa1-915f-42874b58bf37)

  ![image](https://github.com/user-attachments/assets/5e36ec35-f407-483b-9b5b-ca88f916b15a)

  ![image](https://github.com/user-attachments/assets/5ea490ea-93c2-40d1-8c38-f128414ef7d8)
  
  ![image](https://github.com/user-attachments/assets/c94efca6-9fb3-4516-aec9-6e063c69a291)

  ![image](https://github.com/user-attachments/assets/7889331b-8a22-4f41-9ed5-fd5cd6aa6704)

![image](https://github.com/user-attachments/assets/dbbbcc66-2482-4e8f-b210-014eb519f11c)


![screencapture-localhost-3000-admin-orders-2025-05-30-19_06_13](https://github.com/user-attachments/assets/2eac5ffe-e64d-4f90-9440-33729126762f)

![image](https://github.com/user-attachments/assets/d1218480-236b-430d-9cd2-afc011e63bf9)

![image](https://github.com/user-attachments/assets/31defd43-a6c9-4c2b-9287-c7a365e922d8)

![image](https://github.com/user-attachments/assets/0b766420-8627-49c5-b55f-40b816800b24)

![image](https://github.com/user-attachments/assets/1b026386-bc90-464c-86df-f981678895d5)












