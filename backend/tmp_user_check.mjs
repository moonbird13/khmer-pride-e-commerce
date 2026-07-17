import db from './src/models/index.js';
import User from './src/models/User.js';

const main = async () => {
  try {
    await db.sequelize.authenticate();
    const user = await User.findOne({ where: { email: 'staff@khmerpride.com' } });
    console.log(JSON.stringify(user ? { id: user.userId, email: user.email, role: user.role, fullName: user.fullName, password: user.password } : null));
  } catch (error) {
    console.error('ERR', error.message);
  } finally {
    await db.sequelize.close();
  }
};

main();
