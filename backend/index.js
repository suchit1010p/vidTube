// Load environment variables once for the whole app
import "./src/config.js";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js"

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running on ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(`MongoDB connection fail !!!`, error)
    })
