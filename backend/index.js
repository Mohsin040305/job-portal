import cookieParser from 'cookie-parser';
import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js'
import cloudinary from "./utils/cloudinary.js";

dotenv.config({});

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
  origin: "https://job-portal-frontend-kd0g.onrender.com",
  credentials: true
};

app.use(cors(corsOptions));

const PORT = process.env.PORT;

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});
cloudinary.api.ping()
  .then(result => console.log("Cloudinary OK:", result))
  .catch(err => console.log("Cloudinary ERROR:", err));


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})
