import db from '../models/index.js';
const { Address } = db;

//----------------------------------------------------
// Select / Search
//----------------------------------------------------

// Find address by ID
export const findAddressById = async (addressId) => {
  return await Address.findByPk(Number(addressId));
};

// Find all addresses for a user
export const findAddressesByUserId = async (userId) => {
  return await Address.findAll({
    where: { userId: Number(userId) }
  });
};

// Find primary/default address for a user
export const findPrimaryAddressByUserId = async (userId) => {
  return await Address.findOne({
    where: { userId: Number(userId) },
    order: [['addressId', 'ASC']]
  });
};

//----------------------------------------------------
// Create
//----------------------------------------------------

// Create new address
export const createAddress = async ({
  userId,
  street,
  houseNumber,
  commune,
  district,
  province
}) => {
  return await Address.create({
    userId: Number(userId),
    street,
    houseNumber,
    commune,
    district,
    province
  });
};

//----------------------------------------------------
// Update
//----------------------------------------------------

// Update address
export const updateAddress = async (addressId, {
  street,
  houseNumber,
  commune,
  district,
  province
}) => {
  return await Address.update(
    {
      street,
      houseNumber,
      commune,
      district,
      province
    },
    { where: { addressId: Number(addressId) } }
  );
};

//----------------------------------------------------
// Delete
//----------------------------------------------------

// Delete address
export const deleteAddress = async (addressId) => {
  return await Address.destroy({
    where: { addressId: Number(addressId) }
  });
};

export default {
  findAddressById,
  findAddressesByUserId,
  findPrimaryAddressByUserId,
  createAddress,
  updateAddress,
  deleteAddress
};
