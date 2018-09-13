import { withTheme } from '@material-ui/core';
import * as React from 'react';
import { Checkpoints } from '../Checkpoints/Checkpoints';
// import { CompletionBar } from '../CompletionBar/CompletionBar';
import { IProjectProgressProps, IProjectProgressState, projectProgressClasses } from './ProjectProgress.ias';

class PresentationProjectProgress extends React.Component<IProjectProgressProps, IProjectProgressState> {
    public render() {
        const {
            checkpointsContainer,
            // completionBar,
            // sectionHeader,
        } = projectProgressClasses(this.props, this.state);

        return (
            <div className={checkpointsContainer}>
                {/* <Typography variant="display1" className={sectionHeader}>Project Progress</Typography>
                <div className={completionBar}>
                    <CompletionBar percentComplete={75} theme={this.props.theme}/>
                </div>
                <Typography variant="display1" className={sectionHeader}>Project Checkpoints</Typography> */}
                <Checkpoints/>
            </div>
        )
    }
}

export const ProjectProgress = withTheme()(PresentationProjectProgress);

/*

    What will a checkpoint have in it?
*/