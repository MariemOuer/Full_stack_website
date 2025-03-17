import routes from "./routes/routes";
import dotenv from "dotenv";
import "module-alias/register";


dotenv.config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", routes);

export default app;
