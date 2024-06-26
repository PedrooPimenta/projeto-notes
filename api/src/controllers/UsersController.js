const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    try {
      // Adicione um bloco try/catch aqui
      const { name, email, password } = request.body;
      const database = await sqliteConnection();

      const checkUserExists = await database.get(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (checkUserExists) {
        throw new AppError("Este e-mail já está cadastrado");
      }

      const hashedPassword = await hash(password, 8);

      await database.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      return response.status(201).json();
    } catch (error) {
      // Trate o erro aqui, você pode enviar uma resposta de erro adequada, logar o erro ou realizar outras ações apropriadas.
      console.error(error);
      return response
        .status(500)
        .json({ error: "Ocorreu um erro durante a criação do usuário" });
    }
  }

  async update(request, response) {
    try {
      // Adicione um bloco try/catch aqui
      const { name, email, password, old_password } = request.body;
      const user_id = request.user.id;

      const database = await sqliteConnection();
      const user = await database.get("SELECT * FROM users WHERE id = (?) ", [
        user_id,
      ]);

      if (!user) {
        throw new AppError("Usuário não encontrado");
      }

      const userWithUpdatedEmail = await database.get(
        "SELECT * FROM users WHERE email = (?) ",
        [email]
      );

      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
        throw new AppError("Este e-mail já está em uso");
      }

      user.name = name || user.name;
      user.email = email || user.email;

      if (password && !old_password) {
        throw new AppError("Voce precisa informar a senha antiga");
      }

      if (password && old_password) {
        const checkOldPassword = await compare(old_password, user.password);

        if (!checkOldPassword) {
          throw new AppError("A senha antiga não confere");
        }

        user.password = await hash(password, 8);
      }
      await database.run(
        `
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
        [user.name, user.email, user.password, user_id]
      );

      return response.json();
    } catch (error) {
      // Trate o erro aqui da mesma forma que no método create.
      console.error(error);
      return response
        .status(500)
        .json({ AppError: "Ocorreu um erro durante a atualização do usuário" });
    }
  }
}

module.exports = UsersController;
