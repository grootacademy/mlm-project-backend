const dotenv = require("dotenv");
//config
dotenv.config({ path: "config/.env" });

const app = require("./app");
const connectDb = require("./config/database");

//Connect to Database
connectDb();

app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`);
});

