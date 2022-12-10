const AppError = require("../utils/AppError");
const sqlConnection = require("../database/sqlite");
const { hash, compare } = require("bcrypt");

class UserController {
  async create(request, response) {
    const {name, email, password} = request.body;

    const database = await sqlConnection();
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(checkUserExists) {
      throw new AppError('O e-mail informado já existe');
    }

    const hashedPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    response.status(201).json({
      name,
      email,
      hashedPassword
    })
  }

  async update(request, response) {
    const {name, email, password, old_password} = request.body;
    const { id } = request.params;

    const database = await sqlConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if(!user) {
      throw new AppError('O usuário não existe');
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('O e-mail informado já existe');
    }
  

    user.name = name ?? user.name; //nullish operator
    user.email = email ?? user.email 

    if(password && !old_password) {
      throw new AppError("Você precisa digitar a senha antiga");
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if(!checkOldPassword) {
        throw new AppError("As senhas não conferem");
      }
    }

    user.password = await hash(password, 8);

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME ('now')
      WHERE id = ?`,
      [user.name, user.email, password, id]);

      return response.status(200).json();
    
  }

}

module.exports = UserController;