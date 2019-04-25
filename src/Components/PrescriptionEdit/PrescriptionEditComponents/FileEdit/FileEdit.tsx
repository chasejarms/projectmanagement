import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Typography,
} from '@material-ui/core';
import DocumentIcon from '@material-ui/icons/InsertDriveFile';
import * as firebase from 'firebase';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Api from 'src/Api/api';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { IAttachmentMetadata } from 'src/Models/attachmentMetadata';
import { createFileEditClasses, IFileEditProps, IFileEditPropsFromParent, IFileEditState } from './FileEdit.ias';

export class FileEditPresentation extends React.Component<
    IFileEditProps,
    IFileEditState
> {
    public state: IFileEditState = {
        dialogError: '',
        dialogIsOpen: false,
        srcURLs: [],
        uploadingFilesInProgress: false,
    }

    public componentDidUpdate(): void {
        const controlValueExists = !!this.props.controlValue;
        if (controlValueExists && this.props.controlValue.length !== this.state.srcURLs.length) {
            this.createSrcUrls();
        }
    }

    public render() {
        const {
            disabled,
            control,
            controlValue,
        } = this.props;

        const {
            uploadingFilesInProgress,
        } = this.state;

        const {
            addAttachmentInput,
            addAttachmentButton,
            imagesContainer,
            iconContainer,
            documentFilePathContainer,
            documentFilePath,
            attachedImg,
            circularProgressContainer,
        } = createFileEditClasses(this.props, this.state);

        return (
            <div>
                <AsyncButton
                    disabled={disabled || uploadingFilesInProgress}
                    asyncActionInProgress={uploadingFilesInProgress}
                    color="secondary"
                    className={addAttachmentButton}
                >
                    <input
                        type="file"
                        className={addAttachmentInput}
                        onChange={this.handleAddFiles}
                        multiple={true}
                    />
                    {control.label}
                </AsyncButton>
                {controlValue ? (
                    <div className={imagesContainer}>
                        {controlValue.map((_: any, index: number) => {
                            const srcURL = this.state.srcURLs[index];
                            if (!srcURL) {
                                return (
                                    <Paper key={index}>
                                        <div className={circularProgressContainer}>
                                            <CircularProgress
                                                color="secondary"
                                                size={64}
                                                thickness={3}
                                            />
                                        </div>
                                    </Paper>
                                )
                            } else if (srcURL.startsWith('contentType:')) {
                                const originalImagePathArray = (controlValue[index] as IAttachmentMetadata).path.split('/')
                                const originalImagePath = originalImagePathArray[originalImagePathArray.length - 1];
                                return (
                                    <Paper key={index}>
                                        <div className={iconContainer}>
                                            <DocumentIcon/>
                                            <div className={documentFilePathContainer}>
                                                <Typography className={documentFilePath}>{originalImagePath}</Typography>
                                            </div>
                                        </div>
                                    </Paper>
                                )
                            } else {
                                return (
                                    <Paper key={index}>
                                        <img src={srcURL} className={attachedImg} key={index}/>
                                    </Paper>
                                )
                            }
                        })}
                    </div>
                ) : undefined}
                <Dialog open={this.state.dialogIsOpen}>
                    <DialogTitle>Error Uploading Files</DialogTitle>
                    <DialogContent>{this.state.dialogError}</DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    private closeDialog = () => {
        this.setState({
            dialogIsOpen: false,
        })
    }

    private handleAddFiles = async(event: any): Promise<void> => {
        const {
            controlValue,
            control,
        } = this.props;

        if (event.target.files.length < 1) {
            return;
        }

        const files = event.target.files as FileList;
        const companyId = this.props.match.path.split('/')[2];

        let fileIsLargerThan10MB: boolean = false;
        const tenMB = 10000000;
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            if (file.size > tenMB) {
                fileIsLargerThan10MB = true;
                break;
            }
        }

        if (fileIsLargerThan10MB) {
            this.setState({
                dialogIsOpen: true,
                dialogError: 'The maximum file size for each file is 10 MB'
            });
            return;
        }

        this.setState({
            uploadingFilesInProgress: true,
        })

        const uploadFilePromises: Array<Promise<firebase.storage.UploadTaskSnapshot>>= [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            const uploadFilePromise = Api.projectsApi.uploadFile(companyId, this.props.caseId, file);
            uploadFilePromises.push(uploadFilePromise);
        }

        const uploadDocumentSnapshots = await Promise.all(uploadFilePromises);
        const attachmentMetadataArray = this.convertToAttachmentMetadata(uploadDocumentSnapshots);

        const clonedExistingMetadataArray = cloneDeep(controlValue || []);
        const newMetadataWithExistingMetadata = clonedExistingMetadataArray.concat(attachmentMetadataArray);

        this.props.updateControlValue(control.id, newMetadataWithExistingMetadata);

        this.setState({
            uploadingFilesInProgress: false,
        })
    }

    private convertToAttachmentMetadata = (uploadDocumentSnapshots: firebase.storage.UploadTaskSnapshot[]): IAttachmentMetadata[] => {
        return uploadDocumentSnapshots.map((uploadDocumentSnapshot) => {
            return {
                path: uploadDocumentSnapshot.metadata.fullPath,
                contentType: uploadDocumentSnapshot.metadata.contentType!,
            }
        });
    }

    private createSrcUrls = async() => {
        const attachmentsMetadata: IAttachmentMetadata[] = this.props.controlValue;
        const storageRef = await firebase.storage().ref();
        const downloadURLPromises = await attachmentsMetadata.map(async(attachmentMetadata) => {
            const path = attachmentMetadata.path;
            const contentType = attachmentMetadata.contentType;

            if (contentType.startsWith('image/')) {
                const [
                    companyIdInFile,
                    caseFilesConstant,
                    caseIdInFile,
                    uniqueFolderId,
                    ...actualFileName
                ] = path.split('/');

                const fileNameWithoutSeparation = actualFileName.join('');
                let attempts: number = 0;
                while (attempts < 15) {
                    try {
                        const downloadUrl = await storageRef.child(`${companyIdInFile}/${caseFilesConstant}/${caseIdInFile}/${uniqueFolderId}/thumb@512_${fileNameWithoutSeparation}`).getDownloadURL();
                        if (downloadUrl) {
                            return downloadUrl;
                        }
                    } catch (e) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        attempts += 1;
                    }
                }
            } else {
                return Promise.resolve(`contentType:${contentType}`);
            }
        });

        const downloadURLs = await Promise.all(downloadURLPromises);
        this.setState({
            srcURLs: downloadURLs,
        })
    }
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: IFileEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

const connectedComponent = connect(undefined, mapDispatchToProps)(FileEditPresentation);
export const FileEdit = withRouter(connectedComponent);