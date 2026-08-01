import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Doctor Appointment System API",
    version: "1.0.0",
    description: "API documentation for the Doctor Appointment Booking System",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
    {
      url: "https://medical-appointment-system-production-3a81.up.railway.app",
      description: "Production server (Railway)",
    },
  ]
  ,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;