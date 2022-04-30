import { Series } from "../../../models/serie";
import { Categories } from "../../../models/category";
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";
import { Bookshelves } from "../../../models/bookshelf";
import { Creators } from "../../../models/creator";
import { Users } from "../../../models/user";

const { DataTypes } = require('sequelize');
const uuidv1 = require('uuidv1');

export const getById = async ({ userId, episodeId }) => {
    const episode = await Episodes.findOne({ where: { episodeId: episodeId } });

    if (!episode) throw new Error(' EPISODE.EPISODE_NOT_FOUND');

    const serie = await Series.findOne({ where: { serieId: episode.serieId } });

    if (!serie) throw new Error('SERIE.SERIE_NOT_FOUND');

    const similarEpisodes = await Episodes.findAll({ where: { serieId: serie.serieId }, limit: 12 })

    const categoryId = serie.categoryId;

    const category = await Categories.findOne({ where: { categoryId } });

    if (!category) throw new Error('SERIE.CATEGORY_NOT_FOUND');

    const likes = await Likes.findAll({ where: { episodeId } })

    const isLike = userId ? await Likes.findOne({ where: { userId, episodeId } }) : null;

    let isBought = false;

    const bookshelf = userId ? await Bookshelves.findOne({ where: { userId } }) : null;

    if (bookshelf) {
        const episodesId = bookshelf.dataValues.bookshelfItems;
        console.log({ episodesId, episodeId })
        if (episodesId.includes(episodeId)) {
            isBought = true;
        }
    }

    const creatorInfo = await Creators.findOne({
        where: {
            _id: serie.creatorId
        },
        attributes: ["fullName", "description", "sns", "avatar"]
    });

    const result = {
        data: {
            ...episode.dataValues,
            creatorInfo,
            category,
            serie,
            likes: (likes.length || 0) + episode.dataValues.likeInit,
            alreadyLiked: isLike !== null,
            likeInit: 0,
            isBought,
            similarEpisodes,
        }
    };

    return result;
}

export const editEpisodeStatus = async ({ episodeId, userId, type }) => {
    const creator = await Creators.findOne({ where: { _id: userId } });

    if (!creator) throw new Error('EPISODE.EDIT_EPISODE.CREATOR_NOT_FOUND');

    const episode = await Episodes.findOne({ where: { episodeId } });

    if (!episode) throw new Error('EPISODE.EDIT_EPISODE.EPISODE_NOT_FOUND');

    if (type !== 'PUBLISH' && type !== 'UNPUBLISH') throw new Error('EPISODE.EDIT_EPISODE_STATUS.INVLID_TYPE')

    const isPublished = type === 'PUBLISH' ? true : false;

    const result = await Episodes.update({ isPublished }, { where: { episodeId } })

    return result;
}

export const deleteEpisode = async ({ creatorId, episodeId }) => {
    const creator = await Creators.findOne({ where: { _id: creatorId } });

    if (!creator) throw new Error('EPISODE.EDIT_EPISODE.CREATOR_NOT_FOUND');

    const episode = await Episodes.findOne({ where: { episodeId } });

    if (!episode) throw new Error('EPISODE.EDIT_EPISODE.EPISODE_NOT_FOUND');

    const result = await episode.destroy();

    return result;
}

export const getFavorEpisodes = async ({ userId }) => {
    const user = await Users.findOne({ where: { _id: userId } })

    if (!user) throw new Error('EPISDE.GET_FAVORITE.USER_NOT_FOUND')

    const favoriteList = await Likes.findAll({ where: { userId, serieId: null } });

    return favoriteList;
};

export const createEpisode = async ({
    creatorId,
    name,
    chapter,
    key,
    pageNumber,
    description,
    serieId,
    thumbnail,
    price,
}) => {
    const creator = await Creators.findOne({ where: { _id: creatorId } })

    if (!creator) throw new Error('EPISODE.CREATE_EPISODE.CREATOR_NOT_FOUND')

    const serie = await Series.findOne({ where: { serieId } })

    if (!serie) throw new Error('EPISODE.CREATE_EPISODE.SERIE_NOT_FOUND')

    const episodeId = uuidv1();

    const episode = await Episodes.create({
        episodeId,
        name,
        chapter,
        key,
        pageNumber,
        description,
        serieId,
        thumbnail,
        price,
        likeInit: 1000,
        isPublished: false,
    })

    if (!episode) throw new Error('EPISODE.CREATE_EPISODE.FAILED')

    const episodeResult = await Episodes.findOne({ where: { episodeId } })

    if (!episodeResult) throw new Error('EPISODE.CREATE_EPISODE.FAILED')

    return episodeResult?.dataValues;
}

export const editEpisode = async ({
    creatorId,
    episodeId,
    name,
    chapter,
    key,
    pageNumber,
    description,
    thumbnail,
    price,
}) => {
    const creator = await Creators.findOne({ where: { _id: creatorId } })

    if (!creator) throw new Error('EPISODE.EDIT_EPISODE.CREATOR_NOT_FOUND')

    const episode = Episodes.findOne({ where: { episodeId } })

    if (!episode) throw new Error('EPISODE.EDIT_EPISODE.EPISODE_NOT_FOUND')

    const editStatus = await Episodes.update({
        name,
        chapter,
        key,
        pageNumber,
        description,
        thumbnail,
        price,
    }, { where: { episodeId } })

    if (!editStatus) throw new Error('EPISODE.EDIT_EPISODE.FAILED')

    const newEpisode = await Episodes.findOne({ where: { episodeId } })

    if (!newEpisode) throw new Error('EPISODE.EDIT_EPISODE.FAILED')

    return newEpisode?.dataValues;
}