import { Series } from "../../../models/serie";
import { Users } from "../../../models/user";
import { Episodes } from "../../../models/episode";
import { Comments } from "../../../models/comment";

export const createComment = async ({ userId, episodeId = null, serieId = null, description = "" }) => {

    if (!userId) throw new Error('COMMENT.USER_NOT_FOUND');

    const user = await Users.findOne({ where: { _id: userId } })

    if (!user) throw new Error('COMMENT.USER_NOT_FOUND');

    const episode = episodeId ? await Episodes.findOne({ where: { episodeId: episodeId } }) : null;

    const serie = serieId ? await Series.findOne({ where: { serieId: serieId } }) : null;

    if (!serie && !episode) throw new Error('COMMENT.SERIE_AND_EPISODE_INVALID');

    if (serie && episode) throw new Error('COMMENT.SERIE_AND_EPISODE_INVALID');

    let result = await Comments.create({ userId, serieId, episodeId, description })
    console.log({result})

    return result;
}

export const editComment = async ({ userId, commentId, description = "" }) => {

    if (!commentId) throw new Error('COMMENT.COMMENT_ID_REQUIRED');

    const comment = await Comments.findOne({ where: { commentId, userId } })

    if (!comment) throw new Error('COMMENT.COMMENT_NOT_FOUND');

    let result = await comment.update({
        description
    })
    console.log({result})

    return result;
}

export const deleteComment = async ({ userId, commentId }) => {

    if (!commentId) throw new Error('COMMENT.COMMENT_ID_REQUIRED');

    const comment = await Comments.findOne({ where: { commentId, userId } })

    if (!comment) throw new Error('COMMENT.COMMENT_NOT_FOUND');

    try {
        let result = await comment.destroy();
        console.log({result})
    } catch (err) {
        return false;
    }

    return true;
}