interface IMockApiConfig {
    defaultCompanyUsers: boolean;
    defaultWorkflow: boolean;
    defaultProjects: boolean;
}

export const mockApiConfig: IMockApiConfig = {
    defaultCompanyUsers: true,
    defaultWorkflow: true,
    defaultProjects: false,
}