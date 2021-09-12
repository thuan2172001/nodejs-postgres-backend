import { Users } from '../../../models/user';
import { Episodes } from '../../../models/episode';
import { Categories } from '../../../models/category';
import { Series } from '../../../models/serie';

export const getAll = async (args = {}, model) => {
  let modelSchema;
  switch (model) {
    case 'Episodes':
      modelSchema = Episodes;
      break;
    case 'Categories':
      modelSchema = Categories;
      break;
    case 'Series':
      modelSchema = Series;
      break;
    case 'Users':
      modelSchema = Users;
      break;
  }
  const results = await modelSchema.findAll();
  return results;
};
