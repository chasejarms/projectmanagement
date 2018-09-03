import { css } from 'emotion';
import { RouteComponentProps } from "react-router";

// tslint:disable-next-line:no-empty-interface
export interface IUsersPresentationProps extends RouteComponentProps<{}> {}

// tslint:disable-next-line:no-empty-interface
export interface IUsersPresentationState {}

export const createUsersPresentationClasses = (
    props: IUsersPresentationProps,
    state: IUsersPresentationState,
) => {
    const fabButton = css({
        position: 'absolute',
        bottom: 8,
        right: 8,
    })

    return {
        fabButton,
    };
}