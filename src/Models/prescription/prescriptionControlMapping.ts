import { IPrescriptionControlTemplate } from './controls/prescriptionControlTemplate';

export interface IPrescriptionControlMapping {
    /** The control id followed by the actual prescription control template */
    [controlId: string]: IPrescriptionControlTemplate;
}