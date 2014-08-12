# Passport.js User Authentication Demo

This is a simple demo application to demonstrate the use of Node.js, Express, and Passport to create a basic login framework that is connected to MongoDB for storing user data.

# Setup

MongoDB is required for user authentication / storage, so be sure that is installed. Update your DB settings as necessary in the `mongoose.connect` method in `server.js`.

This app demonstrates the use of SSL encryption, so you will need to generate your own cert and key files for it to run the HTTPS server properly. To generate a development cert for local SSL testing, use: `openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key`. This cert is very low level and obviously self signed, which means it should never be used in a production environment. You will notice your browser will display an error when attempting to load the page over HTTPS since the certificate will not have a verified identity. In production a proper SSL cert should be purchased from a verified certificate authority.

Install dependencies with `npm install && bower install`. Then run `npm start` or `nodemon server` to start the app on `https://127.0.0.0:1337`.
