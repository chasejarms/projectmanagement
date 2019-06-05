import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface ILogoProps {
    color: 'white' | 'black' | 'blue',
    width?: number,
}
// tslint:disable-next-line:no-empty-interface
export interface ILogoState {}

export const createLogoClasses = (
    props: ILogoProps,
    state: ILogoState,
) => {
    const width = props.width || 300;
    const height = width / 2;
    const logoContainerClasses = css({
        width,
        height,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
    });

    return {
        logoContainerClasses,
    };
}