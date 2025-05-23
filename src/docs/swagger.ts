import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
<<<<<<< HEAD
    info: { title: "User API", version: "1.0.0" },
  },
  apis: ["./src/routes/*.ts"],
=======
    info: { title: "Tora Viviente API", version: "1.0.0" },
  },
  apis: ["./src/routes/*.ts", "./src/docs/**/*.yaml"], // Incluye el archivo YAML
>>>>>>> 9726a4c12b76eb8d283a1fc93101182ee6b15d5c
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
