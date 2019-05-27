import * as firebase from 'firebase';
import { IContactUsApi, IContactUsRequest } from "./contactUsInterface";

export class ContactUsApi implements IContactUsApi {
    public async contactUs(request: IContactUsRequest): Promise<boolean> {
        const contactUsCloudFunction = firebase.functions().httpsCallable('contactUs');
        try {
            await contactUsCloudFunction(request);
        } catch (e) {
            return false;
        }

        return true;
    }
}