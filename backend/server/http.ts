import express ,{ Application} from "express";
import cors from "cors";

//Config Imports
import { HTTPCONF } from "../configs/http";
import { CorsConfig } from "../configs/cors";

//Global Router Imports
import * as Middleware from "../controllers/global/middleware"
import * as AssetRouter from "../controllers/global/assets";
import * as DefaultRouter from "../controllers/global/default";

//API Router Imports
import * as TestRouter from "../controllers/api/test";
import * as HealthRouter from "../controllers/api/health";
import * as VaultRouter from "../controllers/api/vault";
import * as AuthenticationRouter from '../controllers/api/auth'
import * as CampaignRouter from '../controllers/api/campaign'
const PaymentRouter = require('../controllers/api/payments/payments')

import * as Handlebars from 'express-handlebars'
import * as helpers from 'handlebars-helpers'
import * as handlebars from 'handlebars'

import * as http from "http";
import stoppable from "stoppable"
import { Sentry } from "./sentry";


export class HTTPServer {

    public static server: HTTPServer;
    public static conf: HTTPCONF;
    private app: Application;
    private httpServer!: http.Server & stoppable.WithStop

    private constructor(conf: HTTPCONF) {
        this.app = express();
    }

    static INIT(conf: HTTPCONF): HTTPServer {
        if (!HTTPServer.server) {
            HTTPServer.conf = conf;
            HTTPServer.server = new HTTPServer(conf);
            HTTPServer.RegisterRouter();
            HTTPServer.StartServer(conf.PORT);
            return HTTPServer.server;
        } else return HTTPServer.server;
    }

    static RegisterRouter() {

        //Allow Cors For All
        // if (HTTPServer.conf.AllowCors) this.server.app.use(cors(CorsConfig.confs.default));

        // parse application/x-www-form-urlencoded
        this.server.app.use(express.urlencoded({ extended: false }));

        // parse application/json
        this.server.app.use(express.json());


        this.server.app.use(cors())
        /**
         * @NOTE Below next three this.server.app.set is for setting up server side rendering engine using HBS
         */
        this.server.app.set('view engine', 'hbs')
  
        this.server.app.set('views',`${process.cwd()}/views/pages` )
  
        this.server.app.engine('hbs', Handlebars.engine({
            helpers: helpers.default(),
            layoutsDir: `${process.cwd}/views/layouts`,
            partialsDir: `${process.cwd}/views/partials`,
            defaultLayout:'default',
            extname:'hbs'
        }))

        //Middleware route must be stayed at the beginning.
        this.server.app.use(Middleware.router);


        //serving static files
        this.server.app.use('/assets', AssetRouter.router);

        //Register API routes Here
        this.server.app.use('/api/v1/test', TestRouter.router);

        //@REVIEW TAIMOOR This is how we need to add to all services
        this.server.app.use('/auth/api/v1/health', HealthRouter.router);


        //@REVIEW TAIMOOR This is how we need to add to all services
        this.server.app.use('/auth/api/v1/vault', VaultRouter.router);

        this.server.app.use('/gamer/auth/api/v1', AuthenticationRouter.router)

        this.server.app.use('/campaign/api/v1', CampaignRouter.router)

        this.server.app.use('/payment/api/v1', PaymentRouter)
        //Default Route Must be added at end.
        this.server.app.use('/', DefaultRouter.router);
    }

    static StartServer(port: number) {
        this.server.httpServer = stoppable(this.server.app.listen(port, () => { console.log(`Server Started on Port : ${port}`); }))
        this.server.httpServer.on('close', () => {
            console.log('Server Close Fired');
            process.exit(1);

        })
    }

    static async StopServer() {
        console.log('Stopping Server');
        try {
            if (!this.server) process.exit(1);
            this.server.httpServer.close();

        } catch (error: any) {
            let err: any = error;
            Sentry.Error(err, "Error when stopping server of service Auth");
        }
    }


}