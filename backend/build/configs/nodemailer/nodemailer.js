"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTP = void 0;
const sentry_1 = require("../../server/sentry");
class SMTP {
    static async SendMail(email, subject, otp) {
        try {
        }
        catch (error) {
            console.log("Error sending email ===> ", error);
            sentry_1.Sentry.Error(error, 'Error In Registering Forget Pass');
            /**
             * @TODO Preserve Failures into DB and re-send email when possible
             */
            return undefined;
        }
    }
}
exports.SMTP = SMTP;
//# sourceMappingURL=nodemailer.js.map