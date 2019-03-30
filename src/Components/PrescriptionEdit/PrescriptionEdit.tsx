import * as React from 'react';
import { IPrescriptionBuilderState } from 'src/Pages/PrescriptionBuilder/PrescriptionBuilder.ias';
import { IPrescriptionEditProps } from './PrescriptionEdit.ias';

export class PrescriptionEdit extends React.Component<IPrescriptionEditProps, IPrescriptionBuilderState> {
    public render() {
        return <div>This is the prescription edit component</div>
    }
}