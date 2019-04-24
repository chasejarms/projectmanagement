import {
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { createFileEditClasses, IFileEditProps, IFileEditPropsFromParent, IFileEditState } from './FileEdit.ias';

export class FileEditPresentation extends React.Component<
    IFileEditProps,
    IFileEditState
> {
    public render() {
        const {
            disabled,
            control,
            // controlValue,
        } = this.props;

        const {
            addAttachmentInput,
            addAttachmentButton,
        } = createFileEditClasses(this.props, this.state);

        return (
            <div>
                <Typography variant="body1">{control.label}</Typography>
                <AsyncButton
                    disabled={disabled}
                    asyncActionInProgress={false}
                    color="secondary"
                    className={addAttachmentButton}
                >
                    <input
                        type="file"
                        className={addAttachmentInput}
                        accept={".jpg,.jpeg,.png"}
                        onChange={this.handleAddFiles}
                        value={''}
                    />
                    Add File(s)
                </AsyncButton>
            </div>
        )
    }

    private handleAddFiles = async(event: any): Promise<void> => {
        if (event.target.files.length < 1) {
            return;
        }
    }
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: IFileEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const FileEdit = connect(undefined, mapDispatchToProps)(FileEditPresentation);