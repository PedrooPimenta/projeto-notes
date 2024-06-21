const knex = require("../database/knex");  
const AppError = require("../utils/AppError");  
const {compare} =  require("bcryptjs");
const authConfig = require("../configs/auth");
const {sign} = require("jsonwebtoken");
class SessionsController {
    async create(request, response) {
        try {
            const { email, password } = request.body;
            const user = await knex("users").where({ email }).first();

            if (!user) {
                throw new AppError("Email ou senha incorretos", 401);
            }

            const passwordMatched = await compare(password, user.password);

            if (!passwordMatched) {
                throw new AppError("Email ou senha incorretos", 401);
            }

            const{secret, expiresIn} = authConfig.jwt;
            const token = sign({}, secret,{
                subject: String(user.id),
                expiresIn
            })
            return response.json({user, token});
        } catch (error) {
            console.error(error); 
            return response.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

module.exports = SessionsController;
