import { existsSync, Stats } from 'fs';
import path from 'path';
import { sitemapPath } from '../index';
import { downloadSitemap, getFileStat } from '../../utils/common';


export const downloadShopSitemap = async (shopSitemapLink: string) => {
    // console.log(shopSitemapLink);
    const shopSitemapUrl = new URL(shopSitemapLink);
    const shopSitemap = shopSitemapUrl.pathname.slice(1, -3);
    const shopSitemapPath = path.join(sitemapPath, shopSitemap);

    if (!existsSync(shopSitemapPath)) {
        try {
            await downloadSitemap(shopSitemapLink, shopSitemapPath);
        }
        catch (e) {
            console.log('gunzip error:', e);
        }
    }
    // else {
    //     console.log(shopSitemap, 'exists');
    // }

    return shopSitemapPath;
}


export default (sitemapQueue: string[], pathQueue: string[]) => {
    return new Promise(async (resolve, reject) => {
        if (!sitemapQueue) reject(new Error('empty shop sitemap queue'))

        let url = sitemapQueue.shift()
        while (url) {
            const sitemapUrl = new URL(url)
            const sitemap = sitemapUrl.pathname.slice(1, -3)
            const currentSitemapPath = path.join(sitemapPath, sitemap)

            try {
                const fileStat: Stats = await getFileStat(currentSitemapPath);
                if (!fileStat.isFile) {
                    try {
                        await downloadSitemap(url, currentSitemapPath)
                        pathQueue.push(currentSitemapPath)
                        // console.log('downloading:', currentSitemapPath)
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                else {
                    pathQueue.push(currentSitemapPath)
                    // console.log('downloaded:', currentSitemapPath)
                }
            }
            catch (e) {
                try {
                    await downloadSitemap(url, currentSitemapPath)
                    pathQueue.push(currentSitemapPath)
                    // console.log('downloading:', currentSitemapPath)
                }
                catch (e) {
                    console.log(e);
                }
            }

            url = sitemapQueue.shift()
        }

        resolve(1);
    })
}