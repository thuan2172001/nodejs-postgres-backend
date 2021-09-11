import { SEED_DATA } from '../environment';
import { generateEpisode } from './episode';
import { generateUser } from './user';

export const seed = async () => {
    if (SEED_DATA === 'true') {
        await _seed();
    }
};

const _seed = async () => {
    await generateEpisode();
    await generateUser();
};
