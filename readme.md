## AfricaToken Technical Assessment Interview

Creating a Node.js Express app to handle the upload of a CSV file, stream it directly to a database, and normalize MSISDNs involves several steps. Below is an implementation plan procedure:

1. Project Setup:
-- Initialize a new Node.js project:

mkdir africatoken-assessment
cd africatoken-assessment
npm init -y


2. Install required packages:

npm install:
-- express
-- multer 
-- csv-parser 
-- mongoose
-- dotenv
-- morgan
-- nodemon
-- randomstring


3. Create Project Structure:
-- Create the following project structure:
/africatoken-assessment
  |- /config
    |- index.js
  |- /model
    |- index.js
  |- /route
    |- index.js
  |-.env
  |app.js


4. Normalize MSISDN:
-- Implement the normalizeMSISDN function to convert MSISDN to international format. 

5. Generated the CSV file used for test:
-- Implement the function to generate the csv file for testing using the csv-parser package.

6. Implementing the stream transformation using node:stream packages:
-- where the file is been break down to chunk of data and the MSISDN number is been transformed to an international number asynchronously.

7. Database Configuration:
-- Connection to mongo database using Compass Atlas.


8. Run the App:
Run the application using the following command:
-- npm start


9. Test the App:
-- You can use a tool like Postman or curl to test the file upload endpoint (POST http://localhost:3000/api/upload).