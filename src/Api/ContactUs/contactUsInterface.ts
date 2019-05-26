export interface IContactUsRequest {
    name: string;
    email: string;
    phoneNumber: string;
    message: string;
}

export interface IContactUsApi {
    contactUs(request: IContactUsRequest): Promise<boolean>;
}