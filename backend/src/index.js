// Load environment variables once for the whole app
import "./config.js";
import connectDB from "./db/index.js";
import { app } from "./app.js"

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(port, "0.0.0.0", () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log(`MongoDB connection fail !!!`, error)
    })
