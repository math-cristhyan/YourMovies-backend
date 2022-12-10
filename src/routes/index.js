const { Router } = require("express");

const userRouters = require("./users.routes");
const notesRoutes = require("./notes.routes");
const tagsRouters = require("./tags.routes");

const routes = Router();

routes.use("/users", userRouters );
routes.use("/notes", notesRoutes );
routes.use("/tags", tagsRouters );

module.exports = routes;