import { Users } from '../../../models/user';
import { Episodes } from '../../../models/episodes';

export const getAll = async (args = {}, model) => {
  let modelSchema;
  switch (model) {
    case 'Episodes':
      modelSchema = Episodes;
      break;
    case 'Users':
      modelSchema = Users;
      break;
  }
  const results = await modelSchema.findAll();
  return results;
};
