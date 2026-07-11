import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import User from "../src/models/Users.js";
import sequelize from "../src/config/database.js";


const seedUsers = async () => {
    try {

        const users = [];

        const hashedPassword = await bcrypt.hash(
            "Password123",
            10
        );


        // Admin
        users.push({
            avatarUrl: "default-avatar.png",
            fullName: "Khmer Pride Admin",
            email: "admin@khmerpride.com",
            phone: "012345678",
            password: hashedPassword,
            role: "admin",
            userStatus: "Active",
            isVerified: true
        });


        // Staff
        for (let i = 1; i <= 5; i++) {

            users.push({
                avatarUrl: faker.image.avatar(),
                fullName: faker.person.fullName(),
                email: `staff${i}@khmerpride.com`,
                phone: `012${faker.string.numeric(7)}`,
                password: hashedPassword,
                role: "staff",
                userStatus: "Active",
                isVerified: true
            });

        }


        // Customers
        for (let i = 1; i <= 5; i++) {

            users.push({
                avatarUrl: faker.image.avatar(),
                fullName: faker.person.fullName(),
                email: `customer${i}@gmail.com`,
                phone: `010${faker.string.numeric(7)}`,
                password: hashedPassword,
                role: "customer",
                userStatus: "Active",
                isVerified: true
            });

        }


        await User.bulkCreate(users);

        console.log("✅ User seed completed!");

    } catch (error) {
        console.error("❌ User seed failed:", error);
    }
};


export default seedUsers;