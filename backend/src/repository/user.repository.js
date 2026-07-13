import User from "../models/User.js";

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

//------------------------------
// Select
// -----------------------------

// Find all users.
export const findAllUsers = async () => {
  return await User.findAll();
};

// Find a user by ID.
export const findUserById = async (userId) => {
  return await User.findByPk(userId);
};

// Find a user by email.
export const findUserByEmail = async (email) => {
  return await User.findOne({
    where: {
      email: normalizeEmail(email),
    },
  });
};

//-------------------------------------------
// Create
// ------------------------------------------

// Add a new user.
export const addUser = async (userData) => {
  return await User.create(userData);
};



//------------------------------------------------------
// Update
// -----------------------------------------------------

// Update a user.
export const updateUser = async (userId, userData) => {
  const [updatedRows] = await User.update(userData, {
    where: { userId: userId }, 
  });

  return updatedRows;
};

//verify user
export const verifyUser = async (id) => {
  return await User.update(
    { isVerified: true },
    {
      where: {
        userId: id
      }
    }
  );
};
// Update password
export const updatePassword = async (userId, password) => {
  return await User.update(
    {
      password,
    },
    {
      where: {
        userId,
      },
    }
  );
};

//-------------------------------------------------
// Delete
//-------------------------------------------------

// Delete a user.
export const deleteUser = async (userId) => {
  return await User.destroy({
    where: { userId: userId }, 
  });
};

export default {
  findAllUsers,
  findUserById,
  findUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  verifyUser,
  updatePassword
};