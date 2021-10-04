import { Series } from "../../../models/serie";
import { Categories } from "../../../models/category";
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";
import { Bookshelves } from "../../../models/bookshelf";
import { Creators } from "../../../models/creator";
import { Users } from "../../../models/user";
import S3 from '../../../services/s3/s3';
import { getById } from "../episode/episode.service";

export const getSignedUrl = async ({ episodeId, userId, fromPage = 1, endPage = 1 }) => {
  const episode = await Episodes.findOne({ where: { episodeId } })

  if (!episode) throw new Error('READ.EPISODE_NOT_FOUND')

  const bookshelf = await Bookshelves.findOne({ where: { userId } })

  const bookshelfItems = bookshelf?.dataValues?.bookshelfItems || [];

  const episodeData = episode.dataValues;

  const serieId = episodeData.serieId;

  const serie = await Series.findOne({ where: { serieId } })

  if (!serie) throw new Error('READ.SERIE_NOT_FOUND')

  const episodePrice = episodeData?.price || 0;

  const isLocked = episodePrice !== 0 ? bookshelfItems.includes(episodeId) ? false : true : false

  let signedUrl = [];

  if (!isLocked) {
    for (let i = fromPage; i <= endPage; i++) {
      signedUrl.push(S3.getSignedUrl(`${episode.key}/${i}.png`))
    }
  }

  return {
    signedUrl,
    episode: {
      ...episodeData,
      isLocked,
    },
  }
};

export const getSerie = async ({ userId, serieId }) => {
  const serie = await Series.findOne({ where: { serieId } })

  if (!serie) return null;

  const episodeList = await Episodes.findAll({ where: { serieId } })

  const bookshelf = await Bookshelves.findOne({ where: { userId } });

  const bookshelfItems = bookshelf ? bookshelf.dataValues?.bookshelfItems : [];

  const likes = await Likes.findAll({ where: { serieId } }) || [];

  const alreadyLiked = await Likes.findOne({ where: { userId, serieId } }) || null;

  const episodesData = await Promise.all(
    episodeList.map(
      async ({ chapter, name, episodeId, price, isPublished }) => {
        const inBookShelf = bookshelfItems.includes(episodeId) ? true : false

        const shouldShow = isPublished || inBookShelf;

        const isLocked = price && !inBookShelf;

        if (!shouldShow) return null;

        return {
          chapter,
          name,
          isLocked,
          episodeId,
          likes: 1000 + likes.length,
          alreadyLiked: alreadyLiked !== null,
        };
      }
    )
  );

  return {
    ...serie.dataValues,
    episodes: episodesData.filter((e) => e !== null),
  };
};

export const getSettingRead = async ({ userId }) => {
  const user = await Users.findOne({
    where: {
      _id: userId
    }
  });

  if (!user) {
    throw new Error('READ.USER_NOT_FOUND');
  }

  const { settingRead } = user;

  if (!settingRead) return null;

  return JSON.parse(settingRead);
}

export const updateSettingRead = async ({ userId, settingRead }) => {
  const user = await Users.findOne({
    where: {
      _id: userId
    }
  });

  if (!user) {
    throw new Error('READ.USER.NOT_FOUND');
  }

  const updateCustomer = await Users.update({ settingRead }, { where: { _id: userId } });

  if (!updateCustomer) {
    throw new Error('READ.UPDATE.FAILED');
  }

  return settingRead;
}