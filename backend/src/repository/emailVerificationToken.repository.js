import EmailVerificationToken from "../models/EmailVerificationToken.js";

// create token for email
export const createToken = async (tokenData) => {
    return await EmailVerificationToken.create(tokenData);
};

export const findByToken = async (token, userId) => {
  return await EmailVerificationToken.findOne({
    where: {
      token,
      userId,
    },
  });
};

// Mark as use
export const markAsUsed = async (id) => {
  return await EmailVerificationToken.update(
    {
      isUsed: true
    },
    {
      where: {
        verificationTokenId: id
      }
    }
  );
};

export default {
    createToken,
    findByToken,
    markAsUsed
};