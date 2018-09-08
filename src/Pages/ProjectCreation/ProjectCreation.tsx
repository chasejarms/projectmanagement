import {
    Button,
    Divider,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    withTheme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import * as React from 'react';
import { WorkflowCheckpoint } from '../../Components/WorkflowCheckpoint/WorkflowCheckpoint';
import { users } from '../../MockData/users';
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
            userSearchContainer,
            addUsersContainer,
            textFieldContainer,
            paper,
            searchTextField,
            addedUsersText,
            icon,
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
            const mappedUsers = users.map(user => (
                    <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.type}</TableCell>
                        <TableCell>
                            <AddIcon className={icon}/>
                        </TableCell>
                    </TableRow>
                )
            )

            const addedUsers = ([] as any).map((user: any) => (
                <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>
                        <ClearIcon className={icon}/>
                    </TableCell>
                </TableRow>
            ))

            return (
                <div className={`${stepperContent} ${addUsersContainer}`}>
                    <div className={userSearchContainer}>
                        <div className={textFieldContainer}>
                            <TextField
                                label="Search Users"
                                name="searchUsers"
                                value={''}
                                className={searchTextField}
                            />
                        </div>
                        <Paper className={paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Full Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>User Type</TableCell>
                                        <TableCell/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mappedUsers}
                                </TableBody>
                            </Table>
                        </Paper>
                        <Typography variant={"display1"} className={addedUsersText}>Added Users</Typography>
                        <Paper className={paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Full Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>User Type</TableCell>
                                        <TableCell/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {addedUsers}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                </div>
            )
        }
    }
}

export const ProjectCreation = withTheme()(ProjectCreationPresentation);