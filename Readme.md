# Basic Authentication

## Description
This project is a small web application built with Express.js and React.js. It provides basic user authentication using JWT and stores user data in a MongoDB database.

## Setup
1. Clone the repository:

   ```
   git clone https://github.com/sharma39vishal/Basic-Authentication.git
   ```

2. Install dependencies:

   ```
   npm install
   cd client
   npm install
   ```

3. Create a `.env` file in the `base` directory and add the following environment variables:

   ```
   MDB_CONNECT="Your_MongoDB_Connection_String"
   JWT_SECRET="Your_JWT_Secret_Key"
   ```

4. Start the backend server:
   
   (Production)
   ```
   npm start
   ```

   (Development)
   ```
   npm run dev
   ```

5. Start the frontend development server:

   ```
   cd client
   npm run dev
   ```

6. Access the application in your browser at `http://localhost:5173`.

## License
This project is licensed under the MIT License.