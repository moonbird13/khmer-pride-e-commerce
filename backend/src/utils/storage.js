const persistUser = async (user) => {
  if (global.dbAvailable === false) {
    global.memoryUsers = global.memoryUsers || [];
    const index = global.memoryUsers.findIndex((entry) => entry.email === user.email);
    if (index >= 0) {
      global.memoryUsers[index] = user;
    } else {
      global.memoryUsers.push(user);
    }
    return user;
  }

  return user;
};

const findStoredUser = async (email) => {
  if (global.dbAvailable === false) {
    return global.memoryUsers?.find((entry) => entry.email === email) || null;
  }
  return null;
};

export { persistUser, findStoredUser };
