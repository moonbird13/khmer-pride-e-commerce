import * as userRepository from '../repositories/user.repository.js';

const ALLOWED_ROLES = ['guest', 'customer', 'staff', 'admin'];
const ALLOWED_STATUSES = ['Active', 'Inactive', 'Frozen'];

const listUsersHandler = async (req, res) => {
  try {
    const { role, status } = req.query;
    let users = await userRepository.findAllUsers();

    if (role) {
      users = users.filter((user) => String(user.role).toLowerCase() === String(role).toLowerCase());
    }

    if (status) {
      users = users.filter((user) => String(user.userStatus).toLowerCase() === String(status).toLowerCase());
    }

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load users.' });
  }
};

const getUserByIdHandler = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load user.' });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updates = {};
    if (req.body.role) {
      const normalizedRole = String(req.body.role).trim();
      if (!ALLOWED_ROLES.includes(normalizedRole)) {
        return res.status(400).json({ message: 'Invalid role.' });
      }
      updates.role = normalizedRole;
    }

    if (req.body.userStatus) {
      const normalizedStatus = String(req.body.userStatus).trim();
      if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({ message: 'Invalid user status.' });
      }
      updates.userStatus = normalizedStatus;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid user updates provided.' });
    }

    await userRepository.updateUser(req.params.id, updates);
    const updatedUser = await userRepository.findUserById(req.params.id);
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update user.' });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const deletedRows = await userRepository.deleteUser(req.params.id);
    if (!deletedRows) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to delete user.' });
  }
};

export {
  listUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
};
