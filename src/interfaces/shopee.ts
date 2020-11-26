export interface Sitemap {
    loc: string,
    lastmod: string
}

export interface SitemapNumber {
    shopSitemapNum: number,
    productSitemapNum: number
}

export interface ProductElement {
    productId: string,
    shopId: string
}