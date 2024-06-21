require("express-async-error");
const migrationsRun = require("./database/sqlite/migrations");
const cors = require("cors");
const AppError = require("./utils/AppError");
const express = require('express');
const uploadConfig = require("./configs/upload");
const routes = require("./routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

migrationsRun();

/* Tratando erros */
app.use((error, request, response, next) => {
   if(error instanceof AppError){
      return response.status(error.statusCode).json({
         status: "error",
         message: error.message
      })
   }
   console.error(error);
   return response.status(500).json({
      status: "error",
      message: "Internal server error"
   })
})

/*
app.get("/message/:id/:user", (req, res) => {
   const {id, user} = req.params;
   res.send(`Messagem ID: ${id}. Para o usuário: ${user}.`);
})

app.get("users", (req, res) => {
   const {page,limit } = request.query;

   res.send(`Users page: ${page}. Limit: ${limit}.`);
});
*/


const PORT = 8000;

app.listen(PORT,()=>{
   console.log(`Server is running on Port ${PORT}`);
})