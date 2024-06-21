
const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require("../configs/upload");
const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated"); 
const UsersAvatarController = require("../controllers/UsersAvatarController");

const usersRoutes = Router();
/* usando middleware 
function myMiddleware(request, response, next){
   console.log("passou pelo middleware");
   if(!request.body.isAdmin){
      return response.status(401).json({message: "You are not authorized to perform this action"});
   }

   next();
}

userRoutes.post("/",myMiddleware, usersController.create);
*/
const upload = multer(uploadConfig.MULTER);
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), usersAvatarController.update)
module.exports = usersRoutes;