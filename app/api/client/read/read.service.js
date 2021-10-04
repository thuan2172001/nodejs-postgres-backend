import { Series } from "../../../models/serie";
import { Categories } from "../../../models/category";
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";
import { Bookshelves } from "../../../models/bookshelf";
import { Creators } from "../../../models/creator";
import { Users } from "../../../models/user";
import S3 from '../../../services/s3/s3';

export const getSignedUrl = async ({ episodeId, userId, fromPage = 1, endPage = 1 }) => {
  const episode = await Episodes.findOne({ where: { episodeId } })

  if (!episode) throw new Error('READ.EPISODE_NOT_FOUND')

  const bookshelf = await Bookshelves.findOne({ where: { userId } })

  const bookshelfItems = bookshelf?.dataValues?.bookshelfItems || [];

  const episodeData = episode.dataValues;

  const serieId = episodeData.serieId;

  const serie = await Series.findOne({ where: { serieId } })

  if (!serie) throw new Error('READ.SERIE_NOT_FOUND')

  const serieData = serie.dataValues;

  const episodePrice = episodeData?.price || 0;

  const isLocked = episodePrice !== 0 ? bookshelfItems.includes(episodeId) ? false : true : false

  let signedUrl = [];

  if (!isLocked) {
    console.log({ fromPage, endPage })
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

  console.log({ userId })

  const episodeList = await Episodes.findAll({ where: { serieId } })

  const bookshelf = await Bookshelves.findOne({ where: { userId } });

  console.log({ bookshelf })

  const bookshelfItems = bookshelf ? bookshelf.dataValues?.bookshelfItems : [];

  console.log({ bookshelfItems })

  const episodesData = await Promise.all(
    episodeList.map(
      async ({ chapter, name, episodeId, price, isPublished }) => {
        const inBookShelf = bookshelfItems.includes(episodeId) ? true : false

        console.log({ inBookShelf, isPublished })

        const shouldShow = isPublished || inBookShelf;

        const isLocked = price && !inBookShelf;

        // console.log({ chapter, name, episodeId, price, isPublished, inBookShelf, isLocked, shouldShow })

        if (!shouldShow) return null;

        return {
          chapter,
          name,
          isLocked,
          episodeId,
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