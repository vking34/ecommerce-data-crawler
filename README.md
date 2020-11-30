# Ecommerce Data Crawler


## Concepts
1. __Sitemap.xml__: is a file where you provide information about the pages, videos, and other files on your site, and the relationships between them. That helps search engines find, crawl and index all of your website’s content.

2. __Robot.txt__: A robots.txt file tells search engine crawlers which pages or files the crawler can or can't request from your site. This is used mainly to avoid overloading your site with requests; it is not a mechanism for keeping a web page out of Google. To keep a web page out of Google, you should use noindex directives, or password-protect your page.


## Todos
- Run more async (parallel) tasks for crawling 
- Schedule the crawling task repetitively.
- Save the running checkpoint. So the app can run from the stopping point of the previous execution.



## Start Dev
```
./start.sh
```


## References
- https://nodejs.dev/learn/nodejs-file-stats
- https://nodejs.dev/learn/nodejs-streams
- https://www.npmjs.com/package/xml-flow
- https://mongoosejs.com/docs/guide.html#strict
