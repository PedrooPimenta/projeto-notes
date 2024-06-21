
const { Router } = require('express');

const NotesController = require("../controllers/NotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated"); 

const notesRoutes = Router();
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

const notesController = new NotesController();
notesRoutes.use(ensureAuthenticated); // passa o token de autenticação para todos as notesRoutes

notesRoutes.post('/',notesController.create);
notesRoutes.get('/:id',notesController.show);
notesRoutes.delete('/:id',notesController.delete);
notesRoutes.get('/',notesController.index);


module.exports = notesRoutes;