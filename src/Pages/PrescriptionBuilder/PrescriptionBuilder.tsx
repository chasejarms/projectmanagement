import {
    Drawer, withTheme,
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
        } = createPrescriptionBuilderClasses(this.props, this.state);

        return (
            <Drawer
                variant="permanent"
                anchor="right"
                classes={{
                    paper: drawerPaper,
                }}
            >
                <p>Nothing here</p>
            </Drawer>
        )
    }
}

export const PrescriptionBuilder = withTheme()(PrescriptionBuilderPresentation)