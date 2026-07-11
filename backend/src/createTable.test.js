import sequelize from "./config/database.js";

// Just importing this file loads all models and associations
import "./models/index.js";

const createTables = async () => {
    try {
        await sequelize.authenticate();

        console.log("Database connected.");

        await sequelize.sync();

        console.log("All tables created successfully.");

    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
};

createTables();