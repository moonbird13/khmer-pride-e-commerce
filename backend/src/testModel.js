const db = require('./models');

async function testModels() {
    try {
        await db.sequelize.authenticate();
        console.log("✅ Database connection successful\n");

        for (const [name, model] of Object.entries(db)) {
            // Skip the sequelize instance
            if (name === 'sequelize' || name === 'Sequelize') continue;

            try {
                const result = await model.findOne();

                if (result) {
                    console.log(`✅ ${name}: Model works (found a record)`);
                } else {
                    console.log(`✅ ${name}: Model works (table is empty)`);
                }
            } catch (error) {
                console.log(`❌ ${name}: Model error`);
                console.log(`   ${error.message}\n`);
            }
        }
    } catch (error) {
        console.error("Database connection failed:", error.message);
    } finally {
        await db.sequelize.close();
    }
}

testModels();