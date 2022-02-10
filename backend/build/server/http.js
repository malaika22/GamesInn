"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//Global Router Imports
const Middleware = __importStar(require("../controllers/global/middleware"));
const AssetRouter = __importStar(require("../controllers/global/assets"));
const DefaultRouter = __importStar(require("../controllers/global/default"));
//API Router Imports
const TestRouter = __importStar(require("../controllers/api/test"));
const HealthRouter = __importStar(require("../controllers/api/health"));
const VaultRouter = __importStar(require("../controllers/api/vault"));
const AuthenticationRouter = __importStar(require("../controllers/api/auth"));
const CampaignRouter = __importStar(require("../controllers/api/campaign"));
const PaymentRouter = require('../controllers/api/payments/payments');
const Handlebars = __importStar(require("express-handlebars"));
const helpers = __importStar(require("handlebars-helpers"));
const stoppable_1 = __importDefault(require("stoppable"));
const sentry_1 = require("./sentry");
class HTTPServer {
    constructor(conf) {
        this.app = (0, express_1.default)();
    }
    static INIT(conf) {
        if (!HTTPServer.server) {
            HTTPServer.conf = conf;
            HTTPServer.server = new HTTPServer(conf);
            HTTPServer.RegisterRouter();
            HTTPServer.StartServer(conf.PORT);
            return HTTPServer.server;
        }
        else
            return HTTPServer.server;
    }
    static RegisterRouter() {
        //Allow Cors For All
        // if (HTTPServer.conf.AllowCors) this.server.app.use(cors(CorsConfig.confs.default));
        // parse application/x-www-form-urlencoded
        this.server.app.use(express_1.default.urlencoded({ extended: false }));
        // parse application/json
        this.server.app.use(express_1.default.json());
        this.server.app.use((0, cors_1.default)());
        /**
         * @NOTE Below next three this.server.app.set is for setting up server side rendering engine using HBS
         */
        this.server.app.set('view engine', 'hbs');
        this.server.app.set('views', `${process.cwd()}/views/pages`);
        this.server.app.engine('hbs', Handlebars.engine({
            helpers: helpers.default(),
            layoutsDir: `${process.cwd}/views/layouts`,
            partialsDir: `${process.cwd}/views/partials`,
            defaultLayout: 'default',
            extname: 'hbs'
        }));
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
        this.server.app.use('/gamer/auth/api/v1', AuthenticationRouter.router);
        this.server.app.use('/campaign/api/v1', CampaignRouter.router);
        this.server.app.use('/payment/api/v1', PaymentRouter);
        //Default Route Must be added at end.
        this.server.app.use('/', DefaultRouter.router);
    }
    static StartServer(port) {
        this.server.httpServer = (0, stoppable_1.default)(this.server.app.listen(port, () => { console.log(`Server Started on Port : ${port}`); }));
        this.server.httpServer.on('close', () => {
            console.log('Server Close Fired');
            process.exit(1);
        });
    }
    static async StopServer() {
        console.log('Stopping Server');
        try {
            if (!this.server)
                process.exit(1);
            this.server.httpServer.close();
        }
        catch (error) {
            let err = error;
            sentry_1.Sentry.Error(err, "Error when stopping server of service Auth");
        }
    }
}
exports.HTTPServer = HTTPServer;
//# sourceMappingURL=http.js.map