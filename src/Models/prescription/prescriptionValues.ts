export interface IPrescriptionValues {
    id: string;
    prescriptionFormTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    }
}