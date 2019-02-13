import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderProps {}
// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderState {}

export const createPrescriptionBuilderClasses = (
    props: IPrescriptionBuilderProps,
    state: IPrescriptionBuilderState,
) => {
    const drawerPaper = css({
        width: 320,
    });

    return {
        drawerPaper,
    };
}