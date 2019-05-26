import { IContactUsApi, IContactUsRequest } from "./contactUsInterface";

export class ContactUsApi implements IContactUsApi {
    public contactUs(request: IContactUsRequest): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}