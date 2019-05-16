export interface IProjectCreateDataCloudFunctions {
    id: string;
    prescriptionTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
    companyId: string;
}