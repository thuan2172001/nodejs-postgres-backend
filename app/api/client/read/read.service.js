import { Series } from "../../../models/serie";
import { Categories } from "../../../models/category";
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";
import { Bookshelves } from "../../../models/bookshelf";
import { Creators } from "../../../models/creator";
import { Users } from "../../../models/user";
import S3 from '../../../services/s3/s3';

export const getSignedUrl = async ({ episodeId, userId, page = 1 }) => {
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

  const isLocked = episodePrice !== 0 ? bookshelfItems.contains(episodeId) ? false : true : false

  const signedUrl = !isLocked ? S3.getSignedUrl(`${episode.key}/${page}.png`) : null;

  return {
    signedUrl,
    episode: {
      ...episodeData,
      isLocked,
    },
  }
};
