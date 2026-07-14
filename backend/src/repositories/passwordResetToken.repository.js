import PasswordResetToken from "../models/PasswordResetToken.js";

export const createPassToken = async (tokenData) => {
  return await PasswordResetToken.create(tokenData);
};

export const findByToken = async (token, userId) => {
  return await PasswordResetToken.findOne({
    where: {
      token,
      userId,
    },
  });
};

export const markAsUsed = async (passwordResetTokenId) => {
  return await PasswordResetToken.update(
    {
      isUsed: true,
    },
    {
      where: {
        resetTokenId: passwordResetTokenId,
      },
    }
  );
};

export default {
  createPassToken,
  findByToken,
  markAsUsed
};