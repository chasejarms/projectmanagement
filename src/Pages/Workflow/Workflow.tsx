import { withTheme } from '@material-ui/core';
import * as React from 'react';
import { WorkflowCheckpoint } from '../../Components/WorkflowCheckpoint/WorkflowCheckpoint';
import { workflow } from '../../MockData/workflow';
import { createWorkflowPresentationClasses, IWorkflowPresentationProps, IWorkflowPresentationState } from './Workflow.ias';

export class WorkflowPresentation extends React.Component<IWorkflowPresentationProps, IWorkflowPresentationState> {
    public render() {
        const {
            workflowContainer,
            workflowCheckpointContainer,
        } = createWorkflowPresentationClasses(this.props, this.state);

        const workflowCheckpoints = workflow.checkpoints.map((workflowCheckpoint, index) => {
            const isOddCheckpoint = index % 2 === 0;

            return (
                <div key={index} className={workflowCheckpointContainer}>
                    <WorkflowCheckpoint
                        theme={this.props.theme}
                        workflowCheckpoint={workflowCheckpoint}
                        greyBackground={isOddCheckpoint}
                        isFirstCheckpoint={index === 0}
                        />
                </div>
            )
        });

        return (
            <div className={workflowContainer}>
                {workflowCheckpoints}
            </div>
        );
    }
}

export const Workflow = withTheme()(WorkflowPresentation);