import { Promise } from 'bluebird';

const { Codes } = require('../../../models/code');
const { Users } = require('../../../models/user');
const { Creators } = require('../../../models/creator');
const uuidv1 = require('uuidv1');

export const createCode = async ({ userId }) => {
    const customer = await Users.findOne({ where: { _id: userId } })

    const creator = await Creators.findOne({ wher: { _ud: userId } })

    const user = customer ? customer : creator

    if (!user) throw new Error('CODE.CREATE_CODE.USER_NOT_FOUND')

    const codeExisted = await Codes.findAll({ where: { userId } });

    if (codeExisted.length > 0) {
        const deleteStatus = await Codes.destroy({ where: { userId } });
        console.log({ deleteStatus })
    }

    const codeId = uuidv1();

    const code = await Codes.create({ codeId, userId })

    if (!code) throw new Error('CODE.CREATE_CODE.CREATE_FAILED')

    return codeId;
}

export const verifyCode = async ({ codeId, userId }) => {
    if (!codeId || !userId) throw new Error('CODE.VERIFY_CODE.MISSING_FIELD')

    const code = await Codes.findOne({ where: { codeId, userId } })

    if (!code) throw new Error('CODE.VERIFY_CODE.CODE_NOT_EXISTED')

    const deleteStatus = await Codes.destroy({
        where: { codeId, userId }
    })

    const result = deleteStatus ? true : false;

    return result
}