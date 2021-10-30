import { Categories } from '../../../models/category';

export const getAll = async () => {
  const results = await Categories.findAll();
  return results;
};