import { ISlimDoctor } from "src/Models/slimDoctor";

export const doctorRequiredValidator = (errorMessage: string) => (slimDoctor: ISlimDoctor): string | null => {
    return !!slimDoctor.id && !!slimDoctor.name ? null : errorMessage;
}