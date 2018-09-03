import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface ICompletionBarProps extends WithTheme {
    percentComplete: number,
}
// tslint:disable-next-line:no-empty-interface
export interface ICompletionBarState {}

export const createCompletionBarClasses = (
    props: ICompletionBarProps,
    state: ICompletionBarState,
) => {
    const backgroundDiv = css({
        backgroundColor: '#F3F3F5',
        width: '100%',
        height: 24,
        borderTop: '2px solid #EBEBEE',
        borderBottom: '2px solid #EBEBEE',
        borderLeft: '2px solid #EBEBEE',
        position: 'relative',
        marginBottom: 24,
        flexGrow: 1,
        marginRight: 16,
    });

    const innerBorderDivsStyling = css({
        height: '100%',
        borderRight: '2px solid #EBEBEE',
        flexGrow: 1,
        '&::before': {
            content: '"10"',
            top: 0,
            right: 0,
        }
    });

    const numberDivsContainer = css({
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'row',
    });

    const numberDivsStyling = css({
        flexGrow: 1,
    })

    const innerBorderDivsContainers = css({
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    })

    const progressBarContainer = css({
        display: 'flex',
        position: 'absolute',
        zIndex: 1,
        flexDirection: 'row',
        height: 'calc(100% + 4px)',
        width: 'calc(100% + 2px)',
        top: -2,
        left: -2,
        opacity: .8,
    });

    const progressBar = css({
        flexGrow: props.percentComplete,
        height: '100%',
        backgroundColor: props.theme.palette.secondary.main,
    });

    const alternateProgressBar = css({
        flexGrow: 100 - props.percentComplete,
        height: '100%',
    });

    const completionBarContainer = css({
        display: 'flex',
        flexDirection: 'row',
    });

    return {
        backgroundDiv,
        innerBorderDivsStyling,
        progressBarContainer,
        progressBar,
        alternateProgressBar,
        innerBorderDivsContainers,
        numberDivsContainer,
        numberDivsStyling,
        completionBarContainer,
    };
}

export const createInnerBorderDivsStyling = (
    props: ICompletionBarProps,
    state: ICompletionBarState,
    percentageAmount: number,
    index: number,
) => {
    const percentageString = percentageAmount.toString();
    const {
        fontSize,
        fontFamily,
        color,
        fontWeight,
    } = props.theme.typography.caption;

    const baseCssObject = {
        height: '100%',
        borderRight: '2px solid #EBEBEE',
        flexGrow: 1,
        '&::after': {
            content: `"${percentageString}"`,
            top: 'calc(100% + 5px)',
            left: 'calc(100% - 6px)',
            position: 'absolute',
            fontSize,
            fontFamily,
            fontWeight,
            color,
        },
        position: 'relative',
    } as any;

    if (index === 9) {
        baseCssObject['&::after'].left = 'calc(100% - 11px)';
    } else if (index === 0) {
        baseCssObject['&::before'] = {
            content: `"0"`,
            top: 'calc(100% + 5px)',
            left: -4,
            position: 'absolute',
            fontSize,
            fontFamily,
            fontWeight,
            color,
        };
        baseCssObject['&::after'].left = 'calc(100% - 13px)';
    }

    return css(baseCssObject);
}