import { Series } from "../../../models/serie";
import { Categories } from "../../../models/category";
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";
import { Bookshelves } from "../../../models/bookshelf";
import { Creators } from "../../../models/creator";

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

    let isBought = false;

    const bookshelf = userId ? await Bookshelves.findOne({ where: { userId } }) : null;

    if (bookshelf) {
        const episodesId = bookshelf.dataValues.bookshelfItems;
        console.log({ episodesId, episodeId })
        if (episodesId.includes(episodeId)) {
            isBought = true;
        }
    }

    const result = {
        data: {
            ...episode.dataValues,
            category,
            serie,
            likes: (likes.length || 0) + episode.dataValues.likeInit,
            alreadyLiked: isLike !== null,
            likeInit: 0,
            isBought,
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