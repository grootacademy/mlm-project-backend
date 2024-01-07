const dotenv = require("dotenv");
const connectDb = require("./config/database");

//Hndling uncaught Exception 
process.on("uncaughtException", (error) => {
    console.log(`Error:${error.message}`);
    console.log(`Shutting down the server due to uncaught Exception`);
    process.exit(1)
});

//config
dotenv.config({ path: "config/.env" });

const app = require("./app");

//Connect to Database
connectDb();

app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`);
});

//unhandled promise Rejection
process.on("unhandledRejection", (error) => {
    console.log(`Error:${error.message}`);
    console.log(`Shutting down the server due to unhandled promise Rejection`);
    server.close(() => {
        process.exit(1)
    });
});

