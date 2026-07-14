import Address from '../models/Address.js';

export const findAddressById = async (addressId) => {
  return await Address.findByPk(addressId);
};

export default {
  findAddressById,
};
