import { withTheme } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import { withRouter } from 'react-router';
import { Chat } from '../../Components/Chat/Chat';
import { ProjectProgress } from '../../Components/ProjectProgress/ProjectProgress';
import { ProjectUsers } from '../ProjectUsers/ProjectUsers';
import { createProjectPresentationClasses, IProjectPresentationProps, IProjectPresentationState } from './Project.ias';

class ProjectPresentation extends React.Component<IProjectPresentationProps, IProjectPresentationState> {
    public state = {
        tabValue: 1,
    }

    public tabComponents = {
        0: undefined,
        1: <ProjectProgress key={1} theme={this.props.theme}/>,
        2: <Chat theme={this.props.theme} key={2}/>,
        3: <Chat theme={this.props.theme} key={3}/>,
        4: <ProjectUsers key={4}/>
    }

    constructor(props: IProjectPresentationProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(event: any, value: number): void {
        this.setState({
            tabValue: value,
        })
    }

    public render() {
        const {
            projectContainer,
            tabs,
            tabsContentContainer,
            selectedTab,
            nonSelectedTab,
        } = createProjectPresentationClasses(this.props, this.state, this.props.theme);
        const tabClasses = {
            selected: selectedTab,
            root: nonSelectedTab,
        }

        return (
            <div className={projectContainer}>
                <Tabs value={this.state.tabValue} onChange={this.handleChange} className={tabs}>
                    <Tab
                        disabled={true}
                        label="Project Name"
                        classes={tabClasses}/>
                    <Tab
                        label="Checkpoints"
                        classes={tabClasses}/>
                    <Tab
                        label="Staff Chat"
                        classes={tabClasses}/>
                    <Tab
                        label="Customer Chat"
                        classes={tabClasses}/>
                    <Tab
                        label="Users"
                        classes={tabClasses}
                    />
                </Tabs>
                <div className={tabsContentContainer}>
                    {this.tabComponents[this.state.tabValue]}
                </div>
            </div>
        );
    }

    // private navigateBackToProjectsPage = (): void => {
    //     const splitPath = this.props.location.pathname.split('/');
    //     this.props.history.push(`/${splitPath[1]}/${splitPath[2]}`);
    // }
}

export const Project = withRouter(withTheme()(ProjectPresentation));