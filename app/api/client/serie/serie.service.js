import {Series} from '../../../models/serie';
import {Categories} from '../../../models/category';
import {Users} from '../../../models/user';
import {Sql} from '../../../database';
import {Episodes} from "../../../models/episode";
import {Likes} from "../../../models/like";

const {DataTypes} = require('sequelize');
const uuidv1 = require('uuidv1');

export const getAll = async ({page = 1, limit = 100}) => {
    const results = await Series.findAll({limit: limit});
    return results;
};

export const getById = async ({serieId}) => {
    const serie = await Series.findOne({where: {serieId: serieId}});

    if (!serie) throw new Error('SERIE.SERIE_NOT_FOUND');

    const categoryId = serie.categoryId;

    const category = await Categories.findOne({where: {categoryId}});

    if (!category) throw new Error('SERIE.CATEGORY_NOT_FOUND');

    const episodes = await Episodes.findAll({where: {serieId: serieId}});

    const likes = await Likes.findAll({ where: { episodeId } })

    const result = {
        ...serie.dataValues,
        category: category,
        episodes,
        likes: likes.length ? (likes.length + 1000) : 1000
    };

    return result;
};

export const createSerie = async ({cover, thumbnail, serieName, categoryId, description, userId}) => {
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
