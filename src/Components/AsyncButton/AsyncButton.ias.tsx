import { ButtonProps } from "@material-ui/core/Button";
import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IAsyncButtonProps extends ButtonProps {
    disabled?: boolean;
    asyncActionInProgress?: boolean;
    className?: string;
}
// tslint:disable-next-line:no-empty-interface
export interface IAsyncButtonState {}

export const createAsyncButtonClasses = (
    props: IAsyncButtonProps,
    state: IAsyncButtonState,
) => {
    const materialButton = css({
        position: 'relative',
    });

    const circularProgressContainer = css({
        position: 'absolute',
    })

    return {
        materialButton,
        circularProgressContainer,
    };
}