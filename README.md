# flower-delivery-backend
Table of Contents
Overview
Features
Presentation Link
Live Demo
Technologies Used
API Endpoints
Installation and Setup
Environment Variables
Author
License
Overview
The Flower Website Backend is a Node.js and Express.js-powered RESTful API designed to manage flowers in an online flower shop. This backend provides functionalities to create, read, update, and delete flower entries along with image uploads and category management.

Features
RESTful API for managing flowers
Image upload support using multer
MongoDB database integration with Mongoose
CRUD operations for flowers (Create, Read, Update, Delete)
Category support for flower classification
Middleware for request logging and error handling
Presentation Link
screenshop 
Presentation Link

 [Live Demo:](https://flower-delivery-backend1.onrender.com)
Live Demo

Technologies Used
Node.js
Express.js
MongoDB & Mongoose
Multer (for image uploads)
dotenv (for environment configuration)
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

Set up the environment variables: PORT=4000 MONGO_URI=  mongodb+srv://mammannurain:Mammanurain1@module4.u9yia0t.mongodb.net/?retryWrites=true&w=majority&appName=module4

Start the server:
node server.js

Environment Variables
Ensure you configure the .env file with the correct MongoDB connection string and port.

Author
Name:Fatima Alhassan SalisuContact: [mamannurain20@gmail.com] GitHub: faty584

License
This project is licensed under the MIT License.

