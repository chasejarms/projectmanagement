import * as React from 'react';
import {
    IPrescriptionBuilderProps,
    IPrescriptionBuilderState,
} from './PrescriptionBuilder.ias';

export class PrescriptionBuilder extends React.Component<
    IPrescriptionBuilderProps,
    IPrescriptionBuilderState
> {
    public render() {
        return <div>This is the prescription builder page</div>
    }
}