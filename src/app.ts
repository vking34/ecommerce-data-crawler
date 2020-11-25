import express from 'express';
import http from 'http';
import monogoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

// configs
const port = process.env.PORT || 3003
const app = express();
const server = http.createServer(app);


// db
monogoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
monogoose.Promise = global.Promise;
monogoose.connection.once('open', () => {
    console.log('Connected to mongoDB!');
});


// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());


// routes
import productRoute from './routes/product';
import shopRoute from './routes/shop';

app.use('/v1/crawlers/products', productRoute);
app.use('/v1/crawlers/shops', shopRoute);

// crawler
import crawl from './tasks/index';
crawl();

// 
server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// handle uncaught exceptions
process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
})