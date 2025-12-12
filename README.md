
💡 
AssetVerse is a comprehensive B2B (Business-to-Business) HR & Corporate Asset Management Web Application. It helps companies efficiently manage their physical assets, track inventory, and streamline the asset assignment and return processes.




🌐 Live Site URL

Live URL:https://asset-verse-client.netlify.app/


✨ Key Features
The system implements a full-stack solution with the following key features: 

User Roles and Authentication

Two User Roles: HR Manager (Admin) and Employee (User).


Email/Password and optional Google Social Login integration .

JWT and Role-Based Middleware for secure, protected routes .

HR Manager (Admin) Features

Asset Management: Add, view, edit, and delete company assets in the inventory .

Asset Requests: View, approve, or reject employee asset requests. Approval triggers asset quantity deduction .


Auto-Affiliation Logic: Employees are automatically affiliated with the company upon HR approval of their first asset request.




Employee Management: View a list of affiliated employees and track the used employee limit (X/Y employees used) .


Package Management: Upgrade subscription packages with immediate effect using Stripe Payment Integration .





Dashboard Analytics: Visualize data with Recharts (Pie Chart for asset distribution and Bar Chart for top 5 requested assets) .

Employee (User) Features

My Assets: View a list of all assigned assets from all affiliated companies.


Asset Requests: Browse available assets from affiliated companies and submit requests with a note .


Multi-Company Support: Employees can be affiliated with and request assets from multiple companies simultaneously.




Asset Return: Option to return returnable items with a dedicated "Return" button on the My Assets page.



My Team: View colleagues and upcoming birthdays for an affiliated company .


Profile: Update personal information and upload a profile picture .

Core Technologies and Implementation
Frontend: React/Vite

Backend: Express.js, MongoDB/Mongoose


Styling: DaisyUI (Mandatory: No ShadCN/Chakra UI/Material UI) 



Database: MongoDB with collections for users, assets, requests, employeeAffiliations, assignedAssets, packages, and payments .


Pagination: Server-side pagination implemented for large lists (e.g., Asset/Employee lists) .

📦 NPM Packages Used
The following key packages were used for this project: 

Client Side:

react-router
axios
firebase Auth
daisyui: (The primary CSS framework) 
recharts: (For dashboard analytics) 
@stripe/react-stripe-js: (For payment integration)

Server Side:

express
mongoose
cors
jsonwebtoken: (For JWT and authentication) 
dotenv
stripe: (For backend payment processing)

🛠️ Setup Instructions
Follow these steps to set up the project locally: 

Clone the repositories:

Install dependencies in both the client and server directories:

cd [client-directory]
npm install

cd [server-directory]
npm install
Configure Environment Variables: Create a .env file in both the client and server root directories as described below.

Start the development servers:

Server:

cd [server-directory]
npm start
Client:

cd [client-directory]
npm run dev
🔑 Environment Variables Configuration
The following environment variables are required for the application to run. They must be set in the respective .env files: 
Server (.env)
# MongoDB
# JSON Web Token (JWT)
# Stripe Payment
STRIPE_SECRET_KEY
# Firebase Authentication
# Server API URL
VITE_SERVER_URL= http://localhost:5000
# Stripe Payment
👤 Test Credentials

Admin/HR Test Email: muttaky@elite.com 

Admin/HR Test Password: 123fF*
