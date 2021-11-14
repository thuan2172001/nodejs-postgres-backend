import { SEED_DATA } from '../environment';
import { generateCreator } from './seed-creator';
import { generateCarts } from './seed-cart';
import { generateCategory } from './seed-category';
import { generateEpisode } from './seed-episode';
import { generateLikes } from './seed-like';
import { generateSerie } from './seed-serie';
import { generateUser } from './seed-user';
import { generateBookshelf } from "./seed-bookshelf";
import { generateCode } from './seed-code';
import { generateTransaction } from './seed-transaction';
import { generatePayment } from './seed-payments';

export const seed = async () => {
    if (SEED_DATA === 'true') {
        await _seed();
    }
};

const _seed = async () => {
    await generateCreator();
    await generateCategory();
    await generateSerie();
    await generateEpisode();
    await generateUser();
    await generatePayment();
    await generateCode();
    await generateCarts();
    await generateLikes();
    await generateBookshelf();
    await generateTransaction();
};
