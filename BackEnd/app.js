const express=require("express");
const connectToDb= require("./config/connectToDb");
const { errorHandler, notFound } = require("./middlewares/error");

const cors= require("cors");

require("dotenv").config();


//Connection To Db
connectToDb();
//init app
const app=express();

//Middlewares
app.use(express.json());

//cors policy
app.use(cors({
    origin:"http://localhost:3000"
}));
//routes

app.use("/api/auth",require("./routes/authRoute"));
app.use("/api/users",require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));

app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/blogs",require("./routes/blogRoute"));


app.use("/api/comments1", require("./routes/comments1Route"));
app.use("/api/categories", require("./routes/categoriesRoute"));
app.use("/api/categoriesProd", require("./routes/categoriesProdRoute"));
app.use("/api/products", require("./routes/productsRoute"));
app.use("/api/orders2",require("./routes/order2Route"));
app.use("/api/password",require("./routes/passwordRoute"));
app.use("/api/orders",require("./routes/orderRoute"));
app.use("/api/ordersm",require("./routes/ordermRoute"));


app.use("/api/orders3",require("./routes/order3Route "));


// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

//Runing the server
const PORT=process.env.PORT ||8000;
app.listen(PORT,()=>console.log(`Server working in ${process.env.NODE_ENV} mode on port ${PORT}`));