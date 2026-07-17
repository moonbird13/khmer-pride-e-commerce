import RefreshToken from "../models/RefreshToken.js";

//----------------------------------------------------
// Select Or Search
// ---------------------------------------------------

// Create a refresh token record
export const createToken = async (tokenData) => {
    return await RefreshToken.create(tokenData);
};

// Find By token
export const findByToken = async (token, userId) => {
    return await RefreshToken.findOne({
        where: {
            token,
            userId,
        },
    });
};

//-----------------------------------------------------
// Update
//-----------------------------------------------------

// Revoke Token
export const revokeToken = async (userId, token) => {
  return await RefreshToken.update(
    {
      // no boolean flag in DB; record revocation time only
      revokedAt: new Date(),
    },
    {
      where: {
        userId,
        token,
      },
    }
  );
};

export default {
    createToken,
    findByToken,
    revokeToken
};