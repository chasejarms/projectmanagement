export interface IPrescriptionValues {
    id: string;
    prescriptionTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    }
}