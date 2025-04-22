// Check if required environment variables are set
export const validateEnvVars = () => {
  const requiredEnvVars = [
    "PORT",
    "MONGO_DB_CONNECTION_STRING",
    "JWT_SECRET_KEY",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env?.[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `The following required environment variables are missing: ${missingEnvVars.join(
        ","
      )}`
    );
  }
};
