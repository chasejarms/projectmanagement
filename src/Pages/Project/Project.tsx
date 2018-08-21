import * as React from 'react';
import { withRouter } from 'react-router';
import { IProjectPresentationProps, IProjectPresentationState } from './Project.ias';

class ProjectPresentation extends React.Component<IProjectPresentationProps, IProjectPresentationState> {
    public render() {
        return (
            <div>This is the project page for a given project</div>
        )
    }
}

export const Project = withRouter(ProjectPresentation);