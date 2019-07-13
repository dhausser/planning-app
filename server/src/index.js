import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import errorhandler from 'errorhandler';
import bodyParser from 'body-parser';
import passport from './passport';
import apollo from './apollo';
import routes from './routes';

const app = express();

app.use(errorhandler());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  }),
);
if (process.env.PLATFORM === 'cloud') {
  app.use(passport.initialize());
  app.use(passport.session());
}
app.use('/', routes);

apollo.applyMiddleware({ app });

const port = process.env.NODE_ENV === 'production' ? 8080 : 4000;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(
  `🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`,
));
