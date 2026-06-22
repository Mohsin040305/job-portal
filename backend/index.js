import cookieParser from 'cookie-parser';
import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js'

dotenv.config({});

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'https://job-portal-frontend-kd0g.onrender.com',
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corsOptions));

const PORT = process.env.PORT;

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "frontend/dist/index.html")
    );
  });
}


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})
