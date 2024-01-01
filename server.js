const app = require("./app");
const dotenv = require("dotenv");
const connectDb = require("./config/database");


//config
dotenv.config({ path: "config/.env" });


//Connect to Database
connectDb();


app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`);
});

