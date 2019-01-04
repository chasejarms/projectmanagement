import { withTheme } from '@material-ui/core';
import * as React from 'react';
// import { CompletionBar } from '../CompletionBar/CompletionBar';
import { withRouter } from 'react-router';
import Api from '../../Api/api';
import { Checkpoints } from '../Checkpoints/Checkpoints';
import { IProjectProgressProps, IProjectProgressState, projectProgressClasses } from './ProjectProgress.ias';

class PresentationProjectProgress extends React.Component<IProjectProgressProps, IProjectProgressState> {
    public state: IProjectProgressState = {
        checkpoints: [],
    }

    public componentDidMount(): void {
        Api.projectsApi.getProjectCheckpoints({} as any).then((checkpoints) => {
            this.setState({
                checkpoints,
            });
        });
    }

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
                <Checkpoints checkpoints={this.state.checkpoints} projectCreation={false}/>
            </div>
        )
    }
}

export const ProjectProgress = withRouter(withTheme()(PresentationProjectProgress));

/*

    What will a checkpoint have in it?
*/