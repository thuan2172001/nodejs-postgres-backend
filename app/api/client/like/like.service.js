import { Series } from "../../../models/serie";
import { Users } from "../../../models/user";
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";

export const likeToggle = async ({ userId, episodeId, serieId, status }) => {

    if (!userId) throw new Error('LIKE.USER_NOT_FOUND');

    const user = await Users.findOne({ where: { _id: userId } })

    if (!user) throw new Error('LIKE.USER_NOT_FOUND');

    const episode = episodeId ? await Episodes.findOne({ where: { episodeId: episodeId } }) : null;

    const serie = serieId ? await Series.findOne({ where: { serieId: serieId } }) : null;

    if (!serie && !episode) throw new Error('LIKE.SERIE_AND_EPISODE_INVALID');

    if (serie && episode) throw new Error('LIKE.SERIE_AND_EPISODE_INVALID');

    let result;

    if (status == 'LIKE') {
        result = await Likes.create({
            userId,
            serieId,
            episodeId,
        })
    } else {
        result = await Likes.destroy({
            where: {
                userId,
                serieId,
                episodeId,
            }
        })
    }

    return result;
}