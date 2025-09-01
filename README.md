
# 🌸 Flower Delivery Backend

This is the backend API for the **Flower Delivery** application.  
It is built using **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.  
The backend provides authentication, flower management, and order management endpoints.


## 🚀 Features
- User authentication (signup, login, JWT-based)
- Flower management (CRUD operations)
- Image upload support (Multer)
- Order management (create, view, delete orders)
- Secure password storage (bcrypt)
- MongoDB database connection with Mongoose


## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT** for authentication
- **Multer** for image uploads
- **dotenv** for environment variables

API Endpoints
The API will be running on http://localhost:4000

GET /api/flowers - Retrieve all flowers
GET /api/flowers/:id - Retrieve a specific flower by ID
POST /api/flowers - Add a new flower (with image upload)
PATCH /api/flowers/:id - Update a flower's details
DELETE /api/flowers/:id - Delete a flower and its associated image
Installation and Setup
Clone the repository:

Install dependencies:

Set up the environment variables: PORT=4000 MONGO_URI = mongodb+srv://mammannurain:Mammanurain1@module4.u9yia0t.mongodb.net/?retryWrites=true&w=majority&appName=module4

Start the server:

Environment Variables
Ensure you configure the .env file with the correct MongoDB connection string and port.



How to Run

Clone the repository:
   ```bash
LIVEDEMO :  https://flower-delivery-backend1.onrender.com

   cd flower-delivery-backend/backend

npm install
npm start
node server.js


SCREEN SHOT OF LOOP

Author

Name: fatima alhassan salisu Email: mamannurai20@gmail.com GitHub: faty584

