import * as React from 'react';
import { WorkflowCheckpoint } from '../../Components/WorkflowCheckpoint/WorkflowCheckpoint';
import { workflow } from '../../MockData/workflow';
import { createWorkflowPresentationClasses, IWorkflowPresentationProps, IWorkflowPresentationState } from './Workflow.ias';

export class Workflow extends React.Component<IWorkflowPresentationProps, IWorkflowPresentationState> {
    public render() {
        const {
            workflowContainer,
        } = createWorkflowPresentationClasses(this.props, this.state);

        const workflowCheckpoints = workflow.checkpoints.map((workflowCheckpoint, index) => {
            return <WorkflowCheckpoint workflowCheckpoint={workflowCheckpoint} key={index}/>
        });

        return (
            <div className={workflowContainer}>
                {workflowCheckpoints}
            </div>
        );
    }
}