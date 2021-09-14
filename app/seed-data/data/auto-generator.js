const fs = require('fs');
const uuidv1 = require('uuidv1');
const { Series } = require('../../models/serie');

exports.isExistFile = async (file) => new Promise((resolve, reject) => {
    fs.access(file, fs.constants.F_OK, (error) => {
        if (error) return resolve(false);

        resolve(true);
    });
});

exports.readFile = async (file) => new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (error, data) => {
        if (error) return reject(error);
        resolve(data);
    });
});

exports.appendFile = async (pathFile, data) => new Promise((resolve, reject) => {
    fs.appendFile(pathFile, data, (error) => {
        if (error) return reject(error);

        return resolve(true);
    });
});

exports.writeFile = async (pathFile, data) => new Promise((resolve, reject) => {
    fs.writeFile(pathFile, data, (error) => {
        if (error) return reject(error);

        return resolve(true);
    });
});

exports.deleteFirstLine = async (pathFile) => new Promise((resolve, reject) => {
    fs.readFile(pathFile, 'utf8', (error, data) => {
        if (error) return reject(error);
        const linesExceptFirst = data.split('\n').slice(1).join('\n');
        fs.writeFile(pathFile, linesExceptFirst, (error) => {
            if (error) return reject(error);

            return resolve(true);
        });
    });
});

exports.unlinkFile = async (pathFile) => new Promise((resolve, reject) => {
    fs.unlink(pathFile, (error) => {
        if (error) return reject(error);

        resolve(true);
    });
});

exports.streamToBuffer = (stream) => new Promise((res, rej) => {
    let bufs = [];
    stream.on('data', (d) => bufs.push(d));
    stream.on('end', () => {
        res(Buffer.concat(bufs));
    });
    stream.on('error', (err) => rej(err));
});

export const generateSerieData = async () => {

    const categories = ['cate1', 'cate2', 'cate3', 'cate4', 'cate5', 'cate6'];
    const serieNames = ['Under the sea', 'On the sky', 'Light on', 'The dark', 'Jumanji', 'Justify', 'Pocker', 'Lenova', 'Darknight', 'Mister Babadine', 'Dragon Wars', 'Penhouse', 'On the hill', 'Donkihote and the knight of Kingdom', 'Teddy on the box', 'Destroyer']
    const descriptions = ['Flustered Chart Bank Top Volume Possible Granular Grumpy Alarming Ideal Male Flower Regret Dimension Jumpy Ordinary Level Sock Jubilant Ornery Favorable Tremendous Clothes Genuine Produce Dimwitted Maintenance Pointed Secretary Cultured Milk Plane Husky Plastic ']
    const thumbnails = ['https://nftjapan.s3.ap-southeast-1.amazonaws.com/image/346fa06b-c795-405d-b12c-63b8c21860d7-AriumWeb1x1.028.png', 'https://nftjapan.s3.ap-southeast-1.amazonaws.com/image/45ed8c91-c904-4c35-b57e-1e15a4dfa883-AriumWeb1x1.003.png', 'https://nftjapan.s3.ap-southeast-1.amazonaws.com/image/17a0393f-bbff-494a-bb7d-e32f36413ced-AriumWeb1x1.031.png', 'https://nftjapan.s3.ap-southeast-1.amazonaws.com/image/7fa5fc19-e318-4c92-9478-1fc566b92e23-AriumWeb1x1.015.png'];
    const covers = ['https://nftjapan.s3.ap-southeast-1.amazonaws.com/image/f0c37c95-af79-42d4-bd96-5888181031e8-AriumWeb20x9.004.png', 'https://nftjapan.s3.ap-southeast-1.amazonaws.com/image/7a688421-b94a-48ad-9431-ae618a13cd40-AriumWeb20x9.002.png', 'https://nftjapan.s3.ap-southeast-1.amazonaws.com/image/e84c4301-3e79-4813-ae80-4611552b4304-AriumWeb20x9.003.png']

    console.log('right here:')

    let result = ''

    for (let i = 0; i < 100; i++) {
        let serieId = uuidv1();
        let categoryId = categories[Math.floor(Math.random() * (categories.length))]
        let serieName = serieNames[Math.floor(Math.random() * (serieNames.length))] + ' season ' + Math.floor(Math.random() * (21)).toString();
        let description = descriptions[0];
        let thumbnail = thumbnails[Math.floor(Math.random() * (thumbnails.length))]
        let cover = covers[Math.floor(Math.random() * (covers.length))]

        const line = serieId.toString() + ';' + categoryId.toString() + ';' + serieName + ';' + description + ';' + cover + ';' + thumbnail + ';' + 'false';
        result = result + line + '\n';
    }

    return new Promise((resolve, reject) => {
        fs.writeFile('./app/seed-data/data/auto-data-test.csv', result, (error) => {
            if (error) return reject(error);
            return resolve(true);
        });
    });

}

export const generateEpisodeData = async () => {
    // var p = document.createElement("p");
    // p.innerHTML = c.toString();
    // document.body.appendChild(p);

    const categories = ['cate1', 'cate2', 'cate3', 'cate4', 'cate5', 'cate6'];
    const dataNames = ['Under the sea', 'On the sky', 'Light on', 'The dark', 'Jumanji', 'Justify', 'Pocker', 'Lenova', 'Darknight', 'Mister Babadine', 'Dragon Wars', 'Penhouse', 'On the hill', 'Donkihote and the knight of Kingdom', 'Teddy on the box', 'Destroyer']
    const descriptions = ['Flustered Chart Bank Top Volume Possible Granular Grumpy Alarming Ideal Male Flower Regret Dimension Jumpy Ordinary Level Sock Jubilant Ornery Favorable Tremendous Clothes Genuine Produce Dimwitted Maintenance Pointed Secretary Cultured Milk Plane Husky Plastic ']
    const thumbnails = ['https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/060d03f1-2dc6-45f3-9ef9-c075ca589a80-AriumWeb1x1.012.png', 'https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/45ed8c91-c904-4c35-b57e-1e15a4dfa883-AriumWeb1x1.003.png', 'https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/7fa5fc19-e318-4c92-9478-1fc566b92e23-AriumWeb1x1.015.png', 'https://nftjapan.s3.ap-southeast-1.amazonaws.com/image/f7cee056-a816-439b-a37e-5cdbdebdd132-AriumWeb1x1.008.png', 'https://nftjapan.s3.ap-southeast-1.amazonaws.com/image/17a0393f-bbff-494a-bb7d-e32f36413ced-AriumWeb1x1.031.png'];
    const seriesId = '5b81de1c-13a9-11ec-932a-87f66c622227,6109ae96-13a9-11ec-8e51-2f0f02c3fb9e,64b4c260-13a9-11ec-a27f-1be8f9616ea4,677a758a-13a9-11ec-8258-9ba301fcc9b0,6a2aa6d8-13a9-11ec-b1af-333af08ab1c1,6cd6126e-13a9-11ec-96e1-d7dbfdc2d0f5,9f1f5f20-13e3-11ec-88cf-3865926fad55,eb9d5270-13e4-11ec-8cca-796dbae5a572,eb9d5270-13e4-11ec-8c92-040ebc997500,eb9d5270-13e4-11ec-824f-135ded51b96c,eb9d5270-13e4-11ec-8ab7-f22fa35b131d,eb9d5270-13e4-11ec-81a7-4ce1fd7fbf7d,eb9d5270-13e4-11ec-8e4c-6c7d204c722c,eb9d5270-13e4-11ec-8100-a470996a3e14,eb9d5270-13e4-11ec-8349-6f939b39a796,eb9d5270-13e4-11ec-80f5-094fed0129da,eb9d5270-13e4-11ec-8368-863e7e01871e,eb9d5270-13e4-11ec-8b55-8ea2548bd8c5,eb9d5270-13e4-11ec-845b-1ccaf18d34f4,eb9d5270-13e4-11ec-8608-a5fea7095d04,eb9d5270-13e4-11ec-81c4-4367ec2b88fc,eb9d5270-13e4-11ec-849c-bc3ddc610491,eb9d5270-13e4-11ec-89c6-9b542013a374,eb9d5270-13e4-11ec-8c52-eb5eec1f927f,eb9d5270-13e4-11ec-8822-cb1c854d9280,eb9d5270-13e4-11ec-8a83-d8a888488590,eb9d5270-13e4-11ec-8b2e-507c15e37cf5,eb9d5270-13e4-11ec-8f07-8d96feec8c5e,eb9d5270-13e4-11ec-8f5f-026463830066,eb9d5270-13e4-11ec-8d3b-0a30644a33a5,eb9d5270-13e4-11ec-8317-39df94f67f45,eb9d5270-13e4-11ec-8e82-8c580670dac8,eb9d5270-13e4-11ec-840b-93f9b9ce0a72,eb9d5270-13e4-11ec-8cbd-6324f57a00dc,eb9d5270-13e4-11ec-8670-ceb837e6699d,eb9d5270-13e4-11ec-8bb7-1320189e98e3,eb9d5270-13e4-11ec-803f-65d489c8e979,eb9d5270-13e4-11ec-8923-351f6db7066b,eb9d5270-13e4-11ec-8291-de0043f28c5b,eb9d5270-13e4-11ec-8db6-b14d060d966a,eb9d5270-13e4-11ec-82c8-6f9a7fb1b61d,eb9d5270-13e4-11ec-8da1-10f484787748,eb9d5270-13e4-11ec-8f0a-8367d75ca21b,eb9d5270-13e4-11ec-8bda-4719939bb3a2,eb9d5270-13e4-11ec-8830-2604ec6af1d6,eb9d5270-13e4-11ec-8d4a-b2a528bc6874,eb9d5270-13e4-11ec-8428-0ec5d1228ebf,eb9d5270-13e4-11ec-88fe-dbdb8081d043,eb9d5270-13e4-11ec-85f7-fee4c965415c,eb9d5270-13e4-11ec-8a2c-7bff5f463612,eb9d5270-13e4-11ec-85c4-b83b45fb160c,eb9d5270-13e4-11ec-8c77-8e787d2dd2f9,eb9d5270-13e4-11ec-8f19-ad1578ed1fb9,eb9d5270-13e4-11ec-8fe4-3af0ffe6a047,eb9d5270-13e4-11ec-8664-4a89636c2e2e,eb9d5270-13e4-11ec-8a52-cb377c6a73e1,eb9d5270-13e4-11ec-877d-2fbf4dc4ec62,eb9d5270-13e4-11ec-8722-05f894884ceb,eb9d5270-13e4-11ec-8e55-5db32a114f41,eb9d5270-13e4-11ec-8242-9ec15e043c40,eb9d5270-13e4-11ec-83d8-d4d0de17f59f,eb9d5270-13e4-11ec-8282-8bbb5836ed7a,eb9d5270-13e4-11ec-82e0-be2e03386e44,eb9d5270-13e4-11ec-87b0-8ab6bbcf6930,eb9d5270-13e4-11ec-8c64-0b6f917f709b,eb9d5270-13e4-11ec-8cbe-4206bd74a0b5,eb9d5270-13e4-11ec-8a69-eb2e281c1070,eb9d5270-13e4-11ec-8ad6-4c77d73894b9,eb9d5270-13e4-11ec-854d-36c24c17f44c,eb9d5270-13e4-11ec-8489-90cfef7b4216,eb9d5270-13e4-11ec-8621-6b1dcf029b0f,eb9d5270-13e4-11ec-8a3a-c5198cd43348,eb9d5270-13e4-11ec-8212-1d33c23ef691,eb9d5270-13e4-11ec-8cd4-60ed918b0e11,eb9d7980-13e4-11ec-85b6-3f384cdde567,eb9d7980-13e4-11ec-8cbf-69bf9e56be86,eb9d7980-13e4-11ec-879b-c1a55458fe6e,eb9d7980-13e4-11ec-83c7-cc288a40eb83,eb9d7980-13e4-11ec-8626-5bd02554d7bf,eb9d7980-13e4-11ec-8c91-975eea6644a4,eb9d7980-13e4-11ec-8a86-66ef08fc093b,eb9d7980-13e4-11ec-8310-ad622a74bdf3,eb9d7980-13e4-11ec-8bd7-cbda815849a2,eb9d7980-13e4-11ec-844c-4d88b66578ca,eb9d7980-13e4-11ec-87c8-47bd0c63e391,eb9d7980-13e4-11ec-8bca-b5a2c5a140e4,eb9d7980-13e4-11ec-81e2-5463172e00d1,eb9d7980-13e4-11ec-8bef-5a3dbd40a8a3,eb9d7980-13e4-11ec-8f2c-55e0d00d1bdc,eb9d7980-13e4-11ec-899d-5b85b73cbc5b,eb9d7980-13e4-11ec-833f-755974b48649,eb9d7980-13e4-11ec-8bc8-d0589233dcac,eb9d7980-13e4-11ec-8c15-9e249d8e7aec,eb9d7980-13e4-11ec-8e8f-6a78e698ec0c,eb9d7980-13e4-11ec-8b7b-d4d595ab1d5b,eb9d7980-13e4-11ec-8147-7a2edc116fe1,eb9d7980-13e4-11ec-8240-e24a9a9deaca,eb9d7980-13e4-11ec-84b2-82c7aeaf0883,eb9d7980-13e4-11ec-8ae7-028889750b65,eb9d7980-13e4-11ec-8acf-3fcdd9e18b1a,eb9d7980-13e4-11ec-882c-b8861c610abf,eb9d7980-13e4-11ec-8497-2905303997b3,eb9d7980-13e4-11ec-86a2-74654e0f9f2d,eb9d7980-13e4-11ec-896b-f120a4e73855,eb9d7980-13e4-11ec-8895-416a992ff1d0,eb9d7980-13e4-11ec-8fb8-de209e872961,eb9d7980-13e4-11ec-8cec-59a868af55d6'.split(',');
    console.log('right here:')

    let result = ''

    console.log({ seriesId });

    for (let i = 0; i < 6000; i++) {
        let episodeId = uuidv1();
        let chapter = Math.floor(Math.random() * (50));
        let price = Math.floor(Math.random() * (1000));
        let name = dataNames[Math.floor(Math.random() * (dataNames.length))] + ' season ' + Math.floor(Math.random() * (21)).toString();
        let key = `read/${episodeId}_TEN1_sample_210224`;
        let likeInit = Math.floor(Math.random() * (3000)) + Math.floor(Math.random() * (4000)) + 23;

        let description = descriptions[0];
        let thumbnail = thumbnails[Math.floor(Math.random() * (thumbnails.length))]
        let serieId = seriesId[Math.floor(Math.random() * (seriesId.length))]

        const line = chapter.toString() + ';' + name + ';' + key + ';' + '18' + ';' + episodeId.toString() + ';' + description + ';' + serieId + ';' + thumbnail + ';' + price + ';' + likeInit;
        result = result + line + '\n';
    }

    return new Promise((resolve, reject) => {
        fs.writeFile('./app/seed-data/data/auto-data-test.csv', result, (error) => {
            if (error) return reject(error);
            return resolve(true);
        });
    });

}
