import PasswordResetToken from "../models/PasswordResetToken.js";

export const createPassToken = async (tokenData) => {
  const existingToken = await PasswordResetToken.findOne({
    where: { userId: tokenData.userId },
  });

  if (existingToken) {
    await existingToken.update({
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
      isUsed: false,
    });
    return existingToken;
  }

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
