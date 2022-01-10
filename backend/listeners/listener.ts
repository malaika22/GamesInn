import { SubscriberSessionAsPromised } from "rascal";
import { Sentry } from "../server/sentry";


export class TestEventListener {

    public static async BindListener(session: SubscriberSessionAsPromised) {

        try {

            session.on('message', async (message, payload, ackOrNackFn) => {
                try {
                    if (!payload.msg) {
                        Sentry.Error(new Error('Invalid Payload'), `Invalid Payload ${session.name}`);
                        ackOrNackFn(new Error(JSON.stringify(payload)), [{ immediateNack: true, requeue: false, xDeathFix: true, strategy: 'nack' }]);
                    }
                    switch (payload.msg) {
                        default:
                            Sentry.Error(new Error('Unknown Event in FCM EVents'), `Unknown Event ${session.name}`);
                            ackOrNackFn(new Error(JSON.stringify(payload)), [{ immediateNack: true, requeue: false, xDeathFix: true, strategy: 'nack' }]);
                            break;

                    }

                } catch (error: any) {
                    // console.log(error);
                    Sentry.Error(error, `Erros in Processing Message ${JSON.stringify(payload, undefined, 4)}`)
                    ackOrNackFn(new Error(JSON.stringify(payload)), [
                        { strategy: 'republish', defer: 5000, attempts: 10 },
                        { immediateNack: true, requeue: false, xDeathFix: true, strategy: 'nack' }
                    ]);
                }
            });


        } catch (error: any) {
            console.log(error);
            Sentry.Error(error, 'Error in Binding SMTP Event Listeners');
            throw error;
        }


    }
}