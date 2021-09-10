import { Users } from '../../../models/user';

export const getAll = async (args = {}) => {
  const results = await Users.findAll();
  return results;
};
