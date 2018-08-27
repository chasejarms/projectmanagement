import * as React from 'react';
import { ICheckpoint } from '../../Models/checkpoint';
import { Checkpoint } from '../Checkpoint/Checkpoint';
import { IProjectProgressProps, IProjectProgressState } from './ProjectProgress.ias';

const checkpoints: ICheckpoint[] = [
    {
        name: 'Do something',
        description: 'Do something description',
        deadline: new Date(),
        complete: true,
        public: true,
        projectId: '2',
        id: '1',
    },
    {
        name: 'Do something',
        description: 'Do something description',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '2',
    },
    {
        name: 'Do something',
        description: 'Do something description',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '3',
    },
    {
        name: 'Do something',
        description: 'Do something description',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '4',
    },
    {
        name: 'Do something',
        description: 'Do something description',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '5',
    }
]

export class ProjectProgress extends React.Component<IProjectProgressProps, IProjectProgressState> {
    public render() {
        const checkpointElements = checkpoints.map((checkpoint) => {
            return <Checkpoint checkpoint={checkpoint} key={checkpoint.id}/>
        });
        return (
            <div>
                {checkpointElements}
            </div>
        )
    }
}

/*

    What will a checkpoint have in it?
*/