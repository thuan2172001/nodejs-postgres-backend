import { SEED_DATA } from '../environment';
import { generateCategory } from './seed-category';
import { generateEpisode } from './seed-episode';
import { generateLikes } from './seed-like';
import { generateSerie } from './seed-serie';
import { generateUser } from './seed-user';

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
    await generateLikes();
};
