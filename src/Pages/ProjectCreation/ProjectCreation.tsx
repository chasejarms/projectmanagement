import {
    Button,
    Divider,
    Step,
    StepLabel,
    Stepper,
    TextField,
    withTheme,
} from '@material-ui/core';
import * as React from 'react';
import { WorkflowCheckpoint } from '../../Components/WorkflowCheckpoint/WorkflowCheckpoint';
import { workflow } from '../../MockData/workflow';
import {
    createProjectCreationClasses,
    IProjectCreationProps,
    IProjectCreationState,
} from './ProjectCreation.ias';

export class ProjectCreationPresentation extends React.Component<IProjectCreationProps, IProjectCreationState> {
    public state = {
        activeStep: 0,
    }

    public render() {
        const {
            projectCreationContainer,
            stepperContainer,
            topBar,
        } = createProjectCreationClasses(this.props, this.state);

        return (
            <div className={projectCreationContainer}>
                <div className={topBar}>
                    <Stepper activeStep={this.state.activeStep} className={stepperContainer}>
                        <Step>
                            <StepLabel>Project Name</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Add Checkpoints</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Add Users</StepLabel>
                        </Step>
                    </Stepper>
                    {this.createActionButtons()}
                </div>
                <Divider/>
                {this.getStepActiveContent()}
            </div>
        )
    }

    private onNextClick = () => {
        this.setState({
            activeStep: this.state.activeStep + 1,
        })
    }

    private onBackClick = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
        })
    }

    private onSaveClick = () => {
        // tslint:disable-next-line:no-console
        console.log('saving');
    }

    private createActionButtons(): any {
        const {
            actionButtonContainer,
            baseActionButton,
        } = createProjectCreationClasses(this.props, this.state);

        const backButton = this.state.activeStep !== 0 ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.onBackClick}
                color="secondary">
                Back
            </Button>
        ) : undefined;

        const nextButton = this.state.activeStep !== 2 ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.onNextClick}
                color="secondary">
                Next
            </Button>
        ) : undefined;

        const saveButton = this.state.activeStep === 2 ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.onSaveClick}
                color="primary">
                Create Project
            </Button>
        ) : undefined;

        return (
        <div className={actionButtonContainer}>
            {backButton}
            {nextButton}
            {saveButton}
        </div>
        )
    }

    private getStepActiveContent(): any {
        const {
            stepperContent,
            projectNameContainer,
            projectName,
            multipleCheckpointsContainer,
            singleCheckpointContainer,
        } = createProjectCreationClasses(this.props, this.state);

        if (this.state.activeStep === 0) {
            return (
                <div className={`${stepperContent} ${projectNameContainer}`}>
                    <TextField
                        className={projectName}
                        label="Project Name"
                        name="checkpointName"
                        value={''}
                    />
                </div>
            )
        } else if (this.state.activeStep === 1) {
            const workflowCheckpoints = workflow.checkpoints.map((workflowCheckpoint, index) => {
                const isOddCheckpoint = index % 2 === 0;
    
                return (
                    <div key={index} className={singleCheckpointContainer}>
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
                <div className={`${stepperContent} ${multipleCheckpointsContainer}`}>
                    {workflowCheckpoints}
                </div>
            )
        } else if (this.state.activeStep === 2) {
            return (
                <div className={`${stepperContent}`}>
                    <p>The users add page</p>
                </div>
            )
        }
    }
}

export const ProjectCreation = withTheme()(ProjectCreationPresentation);