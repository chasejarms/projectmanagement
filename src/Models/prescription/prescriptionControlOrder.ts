export interface IPrescriptionControlOrder {
    /** The section id followed by a list representing the order of the controls in that section */
    [sectionId: string]: string[],
}