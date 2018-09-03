import { Typography, withTheme } from '@material-ui/core';
import * as React from 'react';
import { ICheckpoint } from '../../Models/checkpoint';
import { Checkpoint } from '../Checkpoint/Checkpoint';
import { CompletionBar } from '../CompletionBar/CompletionBar';
import { IProjectProgressProps, IProjectProgressState, projectProgressClasses } from './ProjectProgress.ias';

const checkpoints: ICheckpoint[] = [
    {
        name: 'Finalize Contract',
        deadline: new Date(),
        complete: true,
        public: true,
        projectId: '2',
        id: '1',
    },
    {
        name: 'Initial Design Specs',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '2',
    },
    {
        name: 'Art Preview',
        description: 'Working with our designers, we create tech packs and finalize art work',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '3',
    },
    {
        name: 'Product Sample',
        description: 'The manufacturer will give us back an exact duplicate of what we can expect the product to look like',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '4',
    },
    {
        name: 'Delivery',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '5',
    }
]

class PresentationProjectProgress extends React.Component<IProjectProgressProps, IProjectProgressState> {
    public render() {
        const {
            checkpointsContainer,
            checkpointStyling,
            completionBar,
            sectionHeader,
        } = projectProgressClasses(this.props, this.state);


        const checkpointElements = checkpoints.map((checkpoint) => {
            return (
                <div key={checkpoint.id} className={checkpointStyling}>
                    <Checkpoint checkpoint={checkpoint}/>
                </div>
            )
        });

        return (
            <div className={checkpointsContainer}>
                <Typography variant="display1" className={sectionHeader}>Project Progress</Typography>
                <div className={completionBar}>
                    <CompletionBar percentComplete={75} theme={this.props.theme}/>
                </div>
                <Typography variant="display1" className={sectionHeader}>Project Checkpoints</Typography>
                {checkpointElements}
            </div>
        )
    }
}

export const ProjectProgress = withTheme()(PresentationProjectProgress);

/*

    What will a checkpoint have in it?
*/