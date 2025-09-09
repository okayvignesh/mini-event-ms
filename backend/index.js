const express = require("express");
const cors = require("cors");
const eventsRoute = require("./routes/events.route");
const { connectToDatabase } = require("./db");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();
const PORT = process.env.PORT || 4003;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Event Management API",
      version: "1.0.0",
    },
    servers: [{ url: process.env.API_BASE }],
  },
  apis: [
    __filename,
    require("path").join(__dirname, "routes", "*.js"),
  ],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Api is running for mini event management system!");
});

app.use("/events", eventsRoute);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
