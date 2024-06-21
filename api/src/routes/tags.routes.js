
const { Router } = require('express');

const TagsController = require("../controllers/TagsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated"); 

const tagsRoutes = Router();
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

const tagsController = new TagsController();

tagsRoutes.get('/', ensureAuthenticated, tagsController.index)

module.exports = tagsRoutes