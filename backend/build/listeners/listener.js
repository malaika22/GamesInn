"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEventListener = void 0;
const sentry_1 = require("../server/sentry");
class TestEventListener {
    static async BindListener(session) {
        try {
            session.on('message', async (message, payload, ackOrNackFn) => {
                try {
                    if (!payload.msg) {
                        sentry_1.Sentry.Error(new Error('Invalid Payload'), `Invalid Payload ${session.name}`);
                        ackOrNackFn(new Error(JSON.stringify(payload)), [{ immediateNack: true, requeue: false, xDeathFix: true, strategy: 'nack' }]);
                    }
                    switch (payload.msg) {
                        default:
                            sentry_1.Sentry.Error(new Error('Unknown Event in FCM EVents'), `Unknown Event ${session.name}`);
                            ackOrNackFn(new Error(JSON.stringify(payload)), [{ immediateNack: true, requeue: false, xDeathFix: true, strategy: 'nack' }]);
                            break;
                    }
                }
                catch (error) {
                    // console.log(error);
                    sentry_1.Sentry.Error(error, `Erros in Processing Message ${JSON.stringify(payload, undefined, 4)}`);
                    ackOrNackFn(new Error(JSON.stringify(payload)), [
                        { strategy: 'republish', defer: 5000, attempts: 10 },
                        { immediateNack: true, requeue: false, xDeathFix: true, strategy: 'nack' }
                    ]);
                }
            });
        }
        catch (error) {
            console.log(error);
            sentry_1.Sentry.Error(error, 'Error in Binding SMTP Event Listeners');
            throw error;
        }
    }
}
exports.TestEventListener = TestEventListener;
//# sourceMappingURL=listener.js.map