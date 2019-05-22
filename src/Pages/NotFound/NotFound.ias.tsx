import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';

// tslint:disable-next-line:no-empty-interface
export interface INotFoundProps extends RouteComponentProps<any> {}
// tslint:disable-next-line:no-empty-interface
export interface INotFoundState {}

export const createNotFoundClasses = (
    props: INotFoundProps,
    state: INotFoundState,
) => {
    const notFoundPageContainer = css({
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
    });

    const notFoundPaper = css({
        width: 400,
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: 64,
        paddingRight: 64,
    });

    const notFoundDescription = css({
        textAlign: 'center',
        paddingBottom: 32,
    });

    const notFoundTitle = css({
        paddingBottom: 24,
    });

    return {
        notFoundPageContainer,
        notFoundPaper,
        notFoundDescription,
        notFoundTitle,
    };
}
