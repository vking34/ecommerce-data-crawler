import axios from 'axios';
import { createGunzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { createWriteStream } from 'fs';
import fs from 'fs';

const pipe = promisify(pipeline);
export const downloadSitemap = async (url: string, filePath: string) => {
    const gunzip = createGunzip();
    const fileWriteStream = createWriteStream(filePath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        // timeout: 30000
    });

    await pipe(response.data, gunzip, fileWriteStream);
    fileWriteStream.close();
}

export const sleep = (ms: number) => {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    });
}

export const getFileStat = promisify(fs.stat);