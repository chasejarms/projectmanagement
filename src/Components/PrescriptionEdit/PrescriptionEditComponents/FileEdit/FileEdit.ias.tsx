import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IFileControl } from "src/Models/prescription/controls/fileControl";

export interface IFileEditPropsFromParent {
    control: IFileControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
    caseId: string;
}

export interface IFileEditProps extends IFileEditPropsFromParent, RouteComponentProps<any> {
    updateControlValue: (controlId: string, value: any) => void;
}

export interface IFileEditState {
    dialogIsOpen: boolean,
    dialogError: string,
    srcURLs: string[],
    uploadingFilesInProgress: boolean,
    indexOfHoveredItem: number | null,
}

export const createFileEditClasses = (
    props: IFileEditProps,
    state: IFileEditState,
) => {
    const addAttachmentInput = css({
        position: 'absolute',
        width: '100%',
        height: '100%',
        paddingTop: 100,
    });

    const addAttachmentButton = css({
        position: 'relative',
        overflow: 'hidden',
    });

    const imagesContainer = css({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridGap: 16,
        gridRow: '1/1',
        gridColumn: '1/1',
        '&::before': {
            content: '""',
            width: 0,
            paddingBottom: '100%',
            gridRow: '1/1',
            gridColumn: '1/1',
            height: 0,
        },
        '& > *:first-child': {
            gridRow: '1/1',
            gridColumn: '1/1',
        },
        paddingTop: 16,
        paddingBottom: 16,
    });

    const iconContainer = css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        position: 'relative',
    })

    const documentFilePathContainer = css({
        position: 'absolute',
        width: '100%',
        display: 'block',
        textOverflow: 'ellipsis',
        height: 50,
        backgroundColor: 'black',
        opacity: .5,
        bottom: 0,
        paddingLeft: 8,
        paddingRight: 8,
        boxSizing: 'border-box',
    });

    const documentFilePath = css({
        width: '100%',
        display: 'block',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        color: 'white',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        paddingTop: 14,
    });

    const attachedImg = css({
        width: '100%',
    });

    const circularProgressContainer = css({
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    });

    const cancelIconContainer = css({
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 8,
        '&:hover': {
            cursor: 'pointer',
        }
    });

    const downloadIconContainer = css({
        position: 'absolute',
        top: 0,
        right: 53,
        padding: 8,
        '&:hover': {
            cursor: 'pointer',
        }
    });

    const cancelIcon = css({
        fontSize: 32,
    });

    const downloadIcon = css({
        fontSize: 32,
    });

    const attachmentPaper = css({
        position: 'relative',
    });

    return {
        addAttachmentButton,
        addAttachmentInput,
        imagesContainer,
        iconContainer,
        documentFilePathContainer,
        documentFilePath,
        attachedImg,
        circularProgressContainer,
        cancelIconContainer,
        downloadIconContainer,
        cancelIcon,
        downloadIcon,
        attachmentPaper,
    };
}