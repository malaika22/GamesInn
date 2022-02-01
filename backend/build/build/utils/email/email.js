"use strict";
/**
 * @NOTE : WHY NOT USING GMAIL?
 * Even though Gmail is the fastest way to get started with sending emails, it is by no means a preferable
 *  solution unless you are using OAuth2 authentication. Gmail expects the user to be an actual user not a
 *  robot so it runs a lot of heuristics for every login attempt and blocks anything that looks suspicious to
 *  defend the user from account hijacking attempts. For example you might run into trouble if your server is
 *  in another geographical location – everything works in your dev machine but messages are blocked in
 * production.
  */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
/**
 * @TODO Have to make publisher and subscriber for email thing. This code will just publish o rabbit mq
 * whereas the subscribber (Which ive to write) will Subscribe it and shoot email. Check below to understand task
 *
 *  @TODO As example, check this github project https://github.com/nodemailer/nodemailer-amqp-example
 *  This is an example of using RabbitMQ (amqplib) for queueing Nodemailer email messages. This allows you to push messages from your application quickly to
 *  delivery queue and let Nodemailer handle the actual sending asynchronously from a background process.
*/
const nodemailer_1 = __importDefault(require("nodemailer"));
const sentry_1 = require("../../server/sentry");
const email_verification_1 = require("./templates/email-verification");
class Email {
    /**
     * @Note On basis of your project need, transport will be created if you want to send email
     */
    static async CreateTransport() {
        this.testing = await nodemailer_1.default.createTestAccount();
        this.mailTransport = nodemailer_1.default.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: Email.testing.user,
                pass: Email.testing.pass,
            },
        });
    }
    /**
     * @Note
     * Use this function to shoot email. For now we are using testing account, Not a valid gmail account.
     * @params token,
     * @return messageID, previewURL in an object
    */
    static async Shootmail(token) {
        try {
            let info = await this.mailTransport.sendMail({
                from: this.testing.user,
                to: "taimoormuhammad954@gmail.com",
                subject: "Email Verification",
                html: (0, email_verification_1.EmaiVerificationTemplate)(token)
            });
            return {
                messageID: info.messageId,
                previewURL: nodemailer_1.default.getTestMessageUrl(info)
            };
        }
        catch (error) {
            console.log(error);
            sentry_1.Sentry.Error(error, 'Error in Sending Email');
            throw error;
        }
    }
}
exports.Email = Email;
//# sourceMappingURL=email.js.map