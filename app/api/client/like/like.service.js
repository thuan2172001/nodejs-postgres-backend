import { Series } from "../../../models/serie";
import { Users } from "../../../models/user";
import { Episodes } from "../../../models/episode";
import { Likes } from "../../../models/like";

export const likeToggle = async ({ userId, episodeId = null, serieId = null, status }) => {

    if (!userId) throw new Error('LIKE.USER_NOT_FOUND');

    const user = await Users.findOne({ where: { _id: userId } })

    if (!user) throw new Error('LIKE.USER_NOT_FOUND');

    const episode = episodeId ? await Episodes.findOne({ where: { episodeId: episodeId } }) : null;

    const serie = serieId ? await Series.findOne({ where: { serieId: serieId } }) : null;

    if (!serie && !episode) throw new Error('LIKE.SERIE_AND_EPISODE_INVALID');

    if (serie && episode) throw new Error('LIKE.SERIE_AND_EPISODE_INVALID');

    let result = false;

    console.log('debug')

    console.log({ userId, serieId, episodeId })

    const foundItem = await Likes.findOne({ where: { userId, serieId, episodeId } })

    if (status == 'LIKE') {
        if (foundItem) throw new Error('LIKE.ALREADY_LIKED');
        result = await Likes.create({
            userId,
            serieId,
            episodeId,
        })
    } else {
        if (!foundItem) throw new Error('LIKE.UNLIKE_BUT_NOT_FOUND');
        console.log({ foundItem })
        result = await Likes.destroy({ where: { id: foundItem.dataValues.id } })
        console.log({ result })
    }

    return true;
}