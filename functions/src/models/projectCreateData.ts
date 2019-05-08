export interface IProjectCreateDataCloudFunctions {
    id: string;
    prescriptionFormTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
    companyId: string;
}