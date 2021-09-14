import { Series } from "../../../models/serie";
import { Categories } from "../../../models/category";
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";

const { DataTypes } = require('sequelize');
const uuidv1 = require('uuidv1');

export const getById = async ({ userId, episodeId }) => {
    const episode = await Episodes.findOne({ where: { episodeId: episodeId } });

    if (!episode) throw new Error(' EPISODE.EPISODE_NOT_FOUND');

    const serie = await Series.findOne({ where: { serieId: episode.serieId } });

    if (!serie) throw new Error('SERIE.SERIE_NOT_FOUND');

    const categoryId = serie.categoryId;

    const category = await Categories.findOne({ where: { categoryId } });

    if (!category) throw new Error('SERIE.CATEGORY_NOT_FOUND');

    const likes = await Likes.findAll({ where: { episodeId } })

    const isLike = userId ? await Likes.findOne({ where: { userId, episodeId } }) : null;

    const result = {
        data: {
            ...episode.dataValues,
            category,
            serie,
            likes: likes.length ? (likes.length + 1000) : 1000,
            alreadyLiked: isLike !== null,
        }
    };

    return result;
}