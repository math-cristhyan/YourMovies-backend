const { Router } = require("express");
const UserController = require("../controllers/UserControllers");

const userController = new UserController();

const userRoutes = Router();

userRoutes.post("/", userController.create);
userRoutes.put("/:id",userController.update);

module.exports = userRoutes;