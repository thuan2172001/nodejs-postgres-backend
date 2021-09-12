import { SEED_DATA } from '../environment';
import { generateCategory } from './category';
import { generateEpisode } from './episode';
import { generateSerie } from './serie';
import { generateUser } from './user';

export const seed = async () => {
    if (SEED_DATA === 'true') {
        await _seed();
    }
};

const _seed = async () => {
    await generateCategory();
    await generateSerie();
    await generateEpisode();
    await generateUser();
};
