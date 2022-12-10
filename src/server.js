require("express-async-errors");
const express = require("express");// carregando as informações do express, todas as funções da pasta express.
const routes = require("./routes");
const migrationsRun = require("./database/migrations/index");
const AppError = require("./utils/AppError");

migrationsRun();

const app = express(); //inicializando o express.
app.use(express.json());

app.use(routes);

app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error);


  return response.status(500).json({
    "status": "error",
    "message": "Internal server error",
  })
})

const PORT = 3000; // dizer para o express em que porta ele vai funcionar.



app.listen(PORT, () => console.log(`server is running on port ${PORT}`)); // LISTEN -> cria o servidor, ele fica esperando as requisições dessa porta