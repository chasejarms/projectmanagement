import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Tooltip,
    Typography,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import DownloadIcon from '@material-ui/icons/CloudDownload';
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
        indexOfHoveredItem: null,
    }

    // tslint:disable-next-line:variable-name
    private _isMounted: boolean;

    public componentWillMount(): void {
        this._isMounted = true;
        const controlValueExists = !!this.props.controlValue;
        if (controlValueExists) {
            this.createSrcUrls();
        }
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
    }

    public componentDidUpdate(): void {
        const controlValueExists = !!this.props.controlValue;
        if (controlValueExists && this.props.controlValue.length !== this.state.srcURLs.length) {
            this.createSrcUrls();
        }

        if (!this.props.controlValue && this.state.srcURLs.length > 0) {
            if (this._isMounted) {
                this.setState({
                    srcURLs: [],
                })
            }
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
            downloadIconContainer,
            cancelIconContainer,
            downloadIcon,
            cancelIcon,
            attachmentPaper,
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
                {controlValue && controlValue.length ? (
                    <div className={imagesContainer}>
                        {controlValue.map((_: any, index: number) => {
                            const srcURL = this.state.srcURLs[index];
                            const srcURLExists = !!srcURL;
                            const originalImagePathArray = (controlValue[index] as IAttachmentMetadata).path.split('/')
                            const originalImagePath = originalImagePathArray[originalImagePathArray.length - 1];
                            return (
                                <Paper key={index} onMouseEnter={this.setHoverItem(index)} onMouseLeave={this.removeHoverItem} className={attachmentPaper}>
                                    {!srcURL ? (
                                         <div className={circularProgressContainer}>
                                            <CircularProgress
                                                color="secondary"
                                                size={64}
                                                thickness={3}
                                            />
                                        </div>
                                    ) : srcURL.startsWith('contentType:') ? (
                                        <div className={iconContainer}>
                                            <DocumentIcon/>
                                            <div className={documentFilePathContainer}>
                                                <Typography className={documentFilePath}>{originalImagePath}</Typography>
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={srcURL} className={attachedImg} key={index}/>
                                    )}
                                    {this.state.indexOfHoveredItem === index && srcURLExists ? (
                                        <div className={downloadIconContainer} onClick={this.downloadImage(index)}>
                                            <Tooltip title="Download File" placement="left">
                                                <DownloadIcon className={downloadIcon} color="secondary"/>
                                            </Tooltip>
                                        </div>
                                    ): undefined}
                                    {this.state.indexOfHoveredItem === index && srcURLExists ? (
                                        <div className={cancelIconContainer} onClick={this.removeImage(index)}>
                                            <Tooltip title="Delete File" placement="right">
                                                <CancelIcon className={cancelIcon} color="secondary"/>
                                            </Tooltip>
                                        </div>
                                    ) : undefined}
                                </Paper>
                            )
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

    private downloadImage = (index: number) => async() => {
        const path = (this.props.controlValue[index] as IAttachmentMetadata).path;
        const storage = firebase.storage();

        const downloadUrl = await storage.ref(path).getDownloadURL() as string;

        // tslint:disable-next-line:no-console
        console.log('getting download url');


        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);
            const fileNameSplit = path.split('/');
            const originalFileName = fileNameSplit[fileNameSplit.length - 1];
            a.download = originalFileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
        };
        // tslint:disable-next-line:no-console
        console.log('downloadUrl: ', downloadUrl);
        xhr.open('GET', downloadUrl);
        xhr.send();
    }

    private removeImage = (index: number) => async() => {
        const srcURLs = this.state.srcURLs.filter((val, compareIndex) => compareIndex !== index);
        if (this._isMounted) {
            this.setState({
                srcURLs,
            });
        }

        const pathToRemove = (this.props.controlValue as IAttachmentMetadata[])[index].path;
        const updatedAttachmentMetadata = (this.props.controlValue as IAttachmentMetadata[]).filter((attachmentMetadata, compareIndex) => {
            return compareIndex !== index;
        });

        this.props.updateControlValue(this.props.control.id, updatedAttachmentMetadata);

        await Api.projectsApi.removeFile(pathToRemove);
    }

    private setHoverItem = (index: number) => () => {
        if (this._isMounted) {
            this.setState({
                indexOfHoveredItem: index,
            })
        }
    }

    private removeHoverItem = () => {
        if (this._isMounted) {
            this.setState({
                indexOfHoveredItem: null,
            })
        }
    }

    private closeDialog = () => {
        if (this._isMounted) {
            this.setState({
                dialogIsOpen: false,
            })
        }
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
            if (this._isMounted) {
                this.setState({
                    dialogIsOpen: true,
                    dialogError: 'The maximum file size for each file is 10 MB'
                });
                return;
            }
        }

        if (this._isMounted) {
            this.setState({
                uploadingFilesInProgress: true,
            })
        }

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

        if (this._isMounted) {
            this.setState({
                uploadingFilesInProgress: false,
            })
        }
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
        if (this._isMounted) {
            this.setState({
                srcURLs: downloadURLs,
            })
        }
    }
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: IFileEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

const connectedComponent = connect(undefined, mapDispatchToProps)(FileEditPresentation);
export const FileEdit = withRouter(connectedComponent) as any;