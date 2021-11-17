import { Series } from "../../../models/serie";
import { Categories } from "../../../models/category";
import { Users } from "../../../models/user";
import { Sql } from "../../../database";
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";
import { Creators } from "../../../models/creator";
import { removeEmptyValueObject } from "../../../utils/validate-utils";
import { getPagination } from "../../../utils/pagination";

const { DataTypes } = require("sequelize");
const uuidv1 = require("uuidv1");

// missing pagination
export const getAllByUser = async ({
  userId = null,
  page = 1,
  limit = 100,
  categoryId = null,
}) => {
  const seriesData = !categoryId
    ? await Series.findAll({
        where: { isPublished: true },
        order: [["createdAt", "DESC"]],
      })
    : await Series.findAll({
        where: { categoryId, isPublished: true },
        order: [["createdAt", "DESC"]],
      });

  let results = [];

  if (!userId)
    return {
      data: getPagination({ array: seriesData, page, limit }),
      totalSeries: seriesData.length,
    };

  await Promise.all(
    seriesData.map(async (serieData) => {
      const liked =
        (await Likes.findOne({
          where: { serieId: serieData.serieId, userId },
        })) || null;
      const serieFinalData = {
        ...serieData.dataValues,
        alreadyLiked: liked !== null,
      };
      results.push(serieFinalData);
    })
  );

  return {
    data: getPagination({ array: results, page, limit }),
    totalSeries: results.length,
  };
};

export const getAllByCreator = async ({
  userId = null,
  page = 1,
  limit = 100,
  isPublished = null,
}) => {
  console.log({ userId, page, limit, isPublished });

  const creator = await Creators.findOne({ where: { _id: userId } });

  if (!creator) throw new Error("SERIE.GET_ALL.CREATOR_NOT_FOUND");

  const publishedSeries = await Series.findAll({
    where: { isPublished: true },
    order: [["createdAt", "DESC"]],
  });
  const unpublishedSeries = await Series.findAll({
    where: { isPublished: false },
    order: [["createdAt", "DESC"]],
  });

  console.log({ isPublished });

  const seriesData =
    isPublished !== null
      ? isPublished == "false"
        ? unpublishedSeries
        : publishedSeries
      : { ...unpublishedSeries, ...publishedSeries };

  console.log({ seriesData });
  let results = [];

  await Promise.all(
    seriesData.map(async (_serieData) => {
      const serieData = _serieData?.dataValues;
      const episodes =
        (await Episodes.findAll({ where: { serieId: serieData.serieId } })) ||
        [];
      const serieFinalData = { ...serieData, episodes: episodes.length };
      results.push(serieFinalData);
    })
  );

  return {
    data: getPagination({ array: results, page, limit }),
    publishedSeriesTotal: publishedSeries.length,
    unpublishedSeries: unpublishedSeries.length,
  };
};

export const getById = async ({
  userId = null,
  serieId,
  page = 1,
  limit = 100,
}) => {
  const serie = await Series.findOne({ where: { serieId: serieId } });

  if (!serie) throw new Error("SERIE.SERIE_NOT_FOUND");

  const categoryId = serie.categoryId;

  const category = await Categories.findOne({ where: { categoryId } });

  if (!category) throw new Error("SERIE.CATEGORY_NOT_FOUND");

  const episodesData = await Episodes.findAll({ where: { serieId: serieId } });

  const likes = await Likes.findAll({ where: { serieId } });

  let episodes = [];

  if (!userId)
    return {
      ...serie.dataValues,
      category: category,
      totalEpisodes: episodesData.length,
      episodes: getPagination({ array: episodesData, page, limit }),
      likes: likes.length ? likes.length + 1000 : 1000,
    };

  await Promise.all(
    episodesData.map(async (episodeData) => {
      const liked =
        (await Likes.findOne({
          where: { episodeId: episodeData.episodeId, userId },
        })) || null;
      const episodeFinalData = {
        ...episodeData.dataValues,
        alreadyLiked: liked !== null,
      };
      episodes.push(episodeFinalData);
    })
  );

  const isLike = userId
    ? await Likes.findOne({ where: { userId, serieId } })
    : null;

  const result = {
    ...serie.dataValues,
    category: category,
    totalEpisodes: episodes.length,
    episodes: getPagination({ array: episodes, page, limit }),
    likes: likes.length ? likes.length + 1000 : 1000,
    alreadyLiked: isLike !== null,
  };

  return result;
};

export const getByIdAndStatus = async ({
  creatorId = null,
  serieId,
  isPublished,
  page = 1,
  limit = 100,
}) => {
  const creator = await Creators.findOne({ where: { _id: creatorId } });

  if (!creator) throw new Error("SERIE.CREATOR_NOT_FOUND");

  const serie = await Series.findOne({ where: { serieId: serieId } });

  if (!serie) throw new Error("SERIE.SERIE_NOT_FOUND");

  const categoryId = serie.categoryId;

  const category = await Categories.findOne({ where: { categoryId } });

  if (!category) throw new Error("SERIE.CATEGORY_NOT_FOUND");

  const publishedEpisodesData = await Episodes.findAll({
    where: { serieId: serieId, isPublished: true },
  });

  const privateEpisodesData = await Episodes.findAll({
    where: { serieId: serieId, isPublished: false },
  });

  const likes = await Likes.findAll({ where: { serieId } });

  return {
    ...serie.dataValues,
    category: category,
    episodes: getPagination({
      array: isPublished ? publishedEpisodesData : privateEpisodesData,
      page,
      limit,
    }),
    likes: likes.length ? likes.length + 1000 : 1000,
    publishedEpisodesTotal: publishedEpisodesData.length,
    privateEpisodesTotal: privateEpisodesData.length,
    totalEpisodes: publishedEpisodesData.length + privateEpisodesData.length,
  };
};

export const createSerie = async ({
  cover,
  thumbnail,
  serieName,
  categoryId,
  description,
  userId,
}) => {
  const creator = await Creators.findOne({ where: { _id: userId } });

  if (!creator) throw new Error("SERIE.EDIT_SERIE.CREATOR_NOT_FOUND");

  if (!cover || !thumbnail || !serieName || !categoryId)
    throw new Error("SERIE.CREATE_SERIE.MISSING_FIELD");

  const result = await Series.create({
    serieId: uuidv1(),
    cover,
    thumbnail,
    serieName,
    categoryId,
    description,
    isPublished: false,
  });
  return result;
};

export const editSerie = async ({
  serieId,
  userId,
  cover,
  thumbnail,
  serieName,
  categoryId,
  description,
}) => {
  const creator = await Creators.findOne({ where: { _id: userId } });

  if (!creator) throw new Error("SERIE.EDIT_SERIE.CREATOR_NOT_FOUND");

  const serie = await Series.findOne({ where: { serieId } });

  if (!serie) throw new Error("SERIE.EDIT_SERIE.SERIE_NOT_FOUND");

  const result = await Series.update(
    { cover, thumbnail, serieName, categoryId, description },
    { where: { serieId } }
  );

  const newSerie = await Series.findOne({ where: { serieId } });

  if (!newSerie) throw new Error("SERIE.EDIT_SERIE.FAILED");

  return newSerie.dataValues;
};

export const editSerieStatus = async ({ serieId, userId, type }) => {
  const creator = await Creators.findOne({ where: { _id: userId } });

  if (!creator) throw new Error("SERIE.EDIT_SERIE.CREATOR_NOT_FOUND");

  const serie = await Series.findOne({ where: { serieId } });

  if (!serie) throw new Error("SERIE.EDIT_SERIE.SERIE_NOT_FOUND");

  if (type !== "PUBLISH" && type !== "UNPUBLISH")
    throw new Error("SERIE.EDIT_SERIE_STATUS.INVLID_TYPE");

  const isPublished = type === "PUBLISH" ? true : false;

  const result = await Series.update({ isPublished }, { where: { serieId } });

  return result;
};
