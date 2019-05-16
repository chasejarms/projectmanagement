import * as React from 'react';
import { IHomeProps, IHomeState } from './Home.ias';

export class Home extends React.Component<IHomeProps, IHomeState> {
    public render() {
        return (
            <div>This is the home page component</div>
        )
    }
}