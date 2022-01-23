/**
 * @NOTE : WHY NOT USING GMAIL? 
 * Even though Gmail is the fastest way to get started with sending emails, it is by no means a preferable
 *  solution unless you are using OAuth2 authentication. Gmail expects the user to be an actual user not a
 *  robot so it runs a lot of heuristics for every login attempt and blocks anything that looks suspicious to
 *  defend the user from account hijacking attempts. For example you might run into trouble if your server is
 *  in another geographical location – everything works in your dev machine but messages are blocked in 
 * production.
  */


/**
 * @TODO Have to make publisher and subscriber for email thing. This code will just publish o rabbit mq
 * whereas the subscribber (Which ive to write) will Subscribe it and shoot email. Check below to understand task
 * 
 *  @TODO As example, check this github project https://github.com/nodemailer/nodemailer-amqp-example
 *  This is an example of using RabbitMQ (amqplib) for queueing Nodemailer email messages. This allows you to push messages from your application quickly to 
 *  delivery queue and let Nodemailer handle the actual sending asynchronously from a background process.
*/

import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import fs from 'fs/promises'

import { Sentry } from '../../server/sentry'
import { EMAIL_VERIFICAION_TEMPLATE } from '../../views/templates/email-verification'

export abstract class Email {

    private static testing: nodemailer.TestAccount
    private static mailTransport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>


    /**
     * @Note On basis of your project need, transport will be created if you want to send email
     */
    public static async CreateTransport() {

        this.testing = await nodemailer.createTestAccount()

        this.mailTransport = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: Email.testing.user,
                pass: Email.testing.pass,

            },
        })


    }



    /**
     * @Note
     * Use this function to shoot email. For now we are using testing account, Not a valid gmail account.
        */

    public static async Shootmail(url:string): Promise<void> {
        try {

            let info = await this.mailTransport.sendMail({
                from: this.testing.user,
                to: "taimoormuhammad954@gmail.com",
                subject: "Email Verification",
                html: EMAIL_VERIFICAION_TEMPLATE
            })


            console.log(` Mail sent with message Id of ${info.messageId}`)
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (error: any) {
            console.log(error);
            Sentry.Error(error, 'Error in Sending Email');
            throw error;
        }

    }




}
