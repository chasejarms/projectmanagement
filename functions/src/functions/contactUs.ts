import { ICloudFunctionsContactUsRequest } from './../models/contactUsRequest';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail = require('@sendgrid/mail');

export const contactUsLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data: ICloudFunctionsContactUsRequest, context) => {
    const SEND_GRID_API_KEY = functions.config().sendgrid.key;
    sgMail.setApiKey(SEND_GRID_API_KEY);
    try {
        const msg = {
            to: 'chasejarms@gmail.com',
            from: 'noreply@shentaro.com',
            templateId: 'd-f2249c82cbee4e07acd6cdfedb88dfa2',
            substitutionWrappers: ['{{', '}}'],
            dynamicTemplateData: {
                name: data.name,
                email: data.email,
                message: data.message,
                phoneNumber: data.phoneNumber,
            }
        }
        await sgMail.send(msg);
    } catch (e) {
        console.log('The send grid email did not work. Here is the email: ', e);
    }
});
