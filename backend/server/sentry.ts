
import * as sentry from '@sentry/node';
import { Logger } from './logger';
import { CaptureContext } from '@sentry/types';
import { RewriteFrames } from '@sentry/integrations';


export interface RemoteLoggerConf {
    type: string;
    options: sentry.NodeOptions;
}

export abstract class Sentry {

    private static tags: any = {};

    public static INIT(conf: sentry.NodeOptions) {
        if (global.logger != 'sentry') return
        // console.log('Sentry : ', conf);
        conf.integrations = [new RewriteFrames({
            root: global.__rootdir__,
            iteratee: (frame) => { return frame; }
        })]
        sentry.init(conf);
        this.tags = {
            'server_name': global.servicename,
            'ip': global.ip
        }
    }


    public static Log(msg: string) {
        try {
            if (global.logger != 'sentry') return

            let ctx: CaptureContext = {
                level: sentry.Severity.Log,
                tags: this.tags
            }
            sentry.captureMessage(msg, ctx);

        } catch (error) {
            Logger.Console(error);
        }
    }

    public static Event(event: sentry.Event) {

        try {
            if (global.logger != 'sentry') return

            sentry.captureEvent(event)

        } catch (error) {
            Logger.Console(error);
        }
    }


    public static Error(msg: Error, name: string) {
        try {
            if (global.logger != 'sentry') return

            // if (!(msg instanceof Error)) msg = new Error((typeof msg == 'string') ? msg : JSON.stringify(msg, undefined, 4));
            let ctx: CaptureContext = {
                level: sentry.Severity.Critical,
                tags: this.tags,
            }
            // let temp = new Error(msg.message);
            // temp.stack = msg.stack
            // temp.name = msg.name;
            msg.name = name;
            // console.log('CTX :', ctx);
            sentry.captureException(msg, ctx);

        } catch (error) {
            Logger.Console(error);
        }
    }

}