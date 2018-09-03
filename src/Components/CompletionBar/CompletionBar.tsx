import { withTheme } from '@material-ui/core';
// import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { createCompletionBarClasses, createInnerBorderDivsStyling, ICompletionBarProps, ICompletionBarState } from './CompletionBar.ias';

const percentageAmounts = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

class PresentationCompletionBar extends React.Component<ICompletionBarProps, ICompletionBarState> {

    public render() {
        const {
            backgroundDiv,
            progressBarContainer,
            progressBar,
            alternateProgressBar,
            innerBorderDivsContainers,
        } = createCompletionBarClasses(this.props, this.state);

        const innerBorderDivs = percentageAmounts.slice(1).map((percentageAmount, index) => {
            const innerBorderDivsStyling = createInnerBorderDivsStyling(
                this.props,
                this.state,
                percentageAmount,
                index,
            );
            return <div className={innerBorderDivsStyling} key={index}/>
        });

        return (
            <div className={backgroundDiv}>
                <div className={innerBorderDivsContainers}>
                    {innerBorderDivs}
                </div>
                <div className={progressBarContainer}>
                    <div className={progressBar}/>
                    <div className={alternateProgressBar}/>
                </div>
            </div>
        )
    }
}

export const CompletionBar = withTheme()(PresentationCompletionBar);