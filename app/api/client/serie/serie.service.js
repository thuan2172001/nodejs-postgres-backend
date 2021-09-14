import { Series } from '../../../models/serie';
import { Categories } from '../../../models/category';
import { Users } from '../../../models/user';
import { Sql } from '../../../database';
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";

const { DataTypes } = require('sequelize');
const uuidv1 = require('uuidv1');

export const getAll = async ({ userId = null, page = 1, limit = 100 }) => {
    const seriesData = await Series.findAll({ limit: limit });

    let results = []

    if (!userId) return seriesData;

    await Promise.all(seriesData.map(async (serieData) => {
        const liked = await Likes.findOne({ where: { serieId: serieData.serieId, userId } }) || null;
        const serieFinalData = { ...serieData.dataValues, alreadyLiked: liked !== null }
        results.push(serieFinalData);
    }))

    return results;
};

export const getById = async ({ userId = null, serieId }) => {
    const serie = await Series.findOne({ where: { serieId: serieId } });

    if (!serie) throw new Error('SERIE.SERIE_NOT_FOUND');

    const categoryId = serie.categoryId;

    const category = await Categories.findOne({ where: { categoryId } });

    if (!category) throw new Error('SERIE.CATEGORY_NOT_FOUND');

    const episodesData = await Episodes.findAll({ where: { serieId: serieId } });

    const likes = await Likes.findAll({ where: { serieId } })

    let episodes = [];

    if (!userId) return {
        ...serie.dataValues,
        category: category,
        episodes: episodesData,
        likes: likes.length ? (likes.length + 1000) : 1000,
    }

    await Promise.all(episodesData.map(async (episodeData) => {
        const liked = await Likes.findOne({ where: { episodeId: episodeData.episodeId, userId } }) || null;
        const episodeFinalData = { ...episodeData.dataValues, alreadyLiked: liked !== null }
        episodes.push(episodeFinalData);
    }))

    const isLike = userId ? await Likes.findOne({ where: { userId, serieId } }) : null;

    const result = {
        ...serie.dataValues,
        category: category,
        episodes,
        likes: likes.length ? (likes.length + 1000) : 1000,
        alreadyLiked: isLike !== null
    };

    return result;
};

export const createSerie = async ({ cover, thumbnail, serieName, categoryId, description, userId }) => {
    // const userQuery = await Users.findOne({ where: { _id: userId } });

    // if (!userQuery) throw new Error('SERIE.USER_NOT_FOUND');

    // const user = { ...userQuery.dataValues };

    // if (user.role !== "creator") throw new Error('SERIE.USER_NOT_HAVE_PERMISSION');

    const result = await Series.create({
        serieId: uuidv1(),
        cover,
        thumbnail,
        serieName,
        categoryId,
        description,
        isPublished: false,
    })
    return result;
};
