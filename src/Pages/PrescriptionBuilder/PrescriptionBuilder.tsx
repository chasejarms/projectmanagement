import {
    Drawer,
    Paper,
    withTheme,
} from '@material-ui/core';
import * as React from 'react';
import {
    createPrescriptionBuilderClasses,
    IPrescriptionBuilderProps,
    IPrescriptionBuilderState,
} from './PrescriptionBuilder.ias';

export class PrescriptionBuilderPresentation extends React.Component<
    IPrescriptionBuilderProps,
    IPrescriptionBuilderState
> {
    public render() {
        const {
            drawerPaper,
            prescriptionBuilderContainer,
            prescriptionFormContainer,
            drawerReplacement,
        } = createPrescriptionBuilderClasses(this.props, this.state);

        return (
            <div className={prescriptionBuilderContainer}>
                <Drawer
                    variant="permanent"
                    anchor="right"
                    classes={{
                        paper: drawerPaper,
                    }}
                >
                    <p>Nothing here</p>
                </Drawer>
                <Paper className={prescriptionFormContainer}>
                    <p>This is where the prescription form container lives</p>
                </Paper>
                <div className={drawerReplacement}/>
            </div>
        )
    }
}

export const PrescriptionBuilder = withTheme()(PrescriptionBuilderPresentation)