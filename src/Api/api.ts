import { AuthenticationApi } from './Authentication/authentication'
import { IAuthenticationApi } from './Authentication/authenticationInterface';
import { MockAuthenticationApi } from './Authentication/mockAuthentication';
import { mockApiConfig } from './mockApi.config';
import { MockUsersApi } from './Users/mockUsers';
import { UsersApi } from './Users/users';
import { IUsersApi } from './Users/usersApiInterface';

const useMockApi: boolean = true;

export interface IApi {
    userApi: IUsersApi;
    authenticationApi: IAuthenticationApi;
}

const mockApi: IApi = {
    userApi: new MockUsersApi(mockApiConfig.defaultCompanyUsers),
    authenticationApi: new MockAuthenticationApi(),
}

const api: IApi = {
    userApi: new UsersApi(),
    authenticationApi: new AuthenticationApi(),
}

export default (useMockApi ? mockApi : api);