import * as firebase from 'firebase';
import { db } from 'src/firebase';
import { ICaseCheckpoint } from 'src/Models/caseCheckpoint';
import { CheckpointFlag } from 'src/Models/caseFilter/checkpointFlag';
import { CompletionStatus } from 'src/Models/caseFilter/completionStatus';
import { DoctorFlag } from 'src/Models/caseFilter/doctorFlag';
import { NotificationFlag } from 'src/Models/caseFilter/notificationFlag';
import { StartedStatus } from 'src/Models/caseFilter/startedStatus';
import { Collections } from 'src/Models/collections';
import { ShowNewInfoFromType } from 'src/Models/showNewInfoFromTypes';
import { UserType } from 'src/Models/userTypes';
import { generateUniqueId } from 'src/Utils/generateUniqueId';
import { ICase } from './../../Models/case';
import { ICaseApi, ICaseCreateRequest, ICasesSearchRequest, IUpdateCaseInformationRequest } from './projectsInterface';

export class ProjectsApi implements ICaseApi {
    public async searchCases(slimCasesSearchRequest: ICasesSearchRequest, userType: string, userId: string): Promise<FirebaseFirestore.QueryDocumentSnapshot[]> {
        // tslint:disable-next-line:no-console
        console.log('slimeCasesSearchRequest: ', slimCasesSearchRequest);

        let query: any = db.collection(Collections.Case)
            .where('companyId', '==', slimCasesSearchRequest.companyId)
            .orderBy('deadline', 'asc')

        if (userType === UserType.Doctor) {
            query = query.where('doctor', '==', userId)
        }

        if (slimCasesSearchRequest.startAfter) {
            query = query.startAfter(slimCasesSearchRequest.startAfter);
        }

        if (slimCasesSearchRequest.startAt) {
            query = query.startAt(slimCasesSearchRequest.startAt);
        }

        if (slimCasesSearchRequest.completionStatus === CompletionStatus.Complete) {
            query = query.where('complete', '==', true);
        } else if (slimCasesSearchRequest.completionStatus === CompletionStatus.Incomplete) {
            query = query.where('complete', '==', false);
        }

        if (slimCasesSearchRequest.startedStatus === StartedStatus.Started) {
            query = query.where('hasStarted', '==', true);
        } else if (slimCasesSearchRequest.startedStatus === StartedStatus.NotStarted) {
            query = query.where('hasStarted', '==', false);
        }

        if (slimCasesSearchRequest.notificationFlag === NotificationFlag.HasNotification) {
            const correctShowNewInfoFromType = userType === UserType.Doctor ? ShowNewInfoFromType.Lab : ShowNewInfoFromType.Doctor;
            query = query.where('showNewInfoFrom', '==', correctShowNewInfoFromType);
        }

        if (slimCasesSearchRequest.checkpointFlag === CheckpointFlag.Specific && slimCasesSearchRequest.checkpointId) {
            // tslint:disable-next-line:no-console
            console.log('inside the checkpoint flag piece');
            const correctCaseKey = userType === UserType.Doctor ? 'currentDoctorCheckpoint' : 'currentLabCheckpoint';
            query = query.where(correctCaseKey, '==', slimCasesSearchRequest.checkpointId);
        }

        const queryForSpecificDoctor = slimCasesSearchRequest.doctorFlag === DoctorFlag.Specific;
        if (queryForSpecificDoctor && slimCasesSearchRequest.doctorId) {
            query = query.where('doctor', '==', slimCasesSearchRequest.doctorId);
        }

        const slimCases = await query.limit(slimCasesSearchRequest.limit).get();
        const slimCasesList: FirebaseFirestore.QueryDocumentSnapshot[] = [];
        slimCases.forEach((document: any) => {
            slimCasesList.push(document);
        })

        return slimCasesList;
    }

    public async createProject(companyId: string, projectCreateRequest: ICaseCreateRequest): Promise<ICase> {
        const createCaseCloudFunction = firebase.functions().httpsCallable('createCase');
        let createCaseResponse: firebase.functions.HttpsCallableResult;

        const caseCreateRequestWithCompanyId = {
            ...projectCreateRequest,
            companyId,
        }
        try {
            createCaseResponse = await createCaseCloudFunction(caseCreateRequestWithCompanyId);
        } catch (error) {
            return Promise.reject(error.message);
        }
        // tslint:disable-next-line:no-console
        console.log('createCaseResponse: ', createCaseResponse);
        return {
            id: createCaseResponse.data,
        } as any;
    }

    public async getProject(caseId: string): Promise<ICase> {
        const documentReference = await firebase.firestore()
            .collection(Collections.Case)
            .doc(caseId)
            .get();

        const createdFromRequest = documentReference.data()!.created as firebase.firestore.Timestamp;
        const mappedControlValues = Object.keys((documentReference.data() as ICase).controlValues).reduce((
            alreadyMappedControlValues,
            controlId,
        ) => {
            const controlValue = documentReference.data()!.controlValues[controlId];
            const shouldBeTimestamp = typeof controlValue === 'object' && controlValue.seconds;
            if (shouldBeTimestamp) {
                alreadyMappedControlValues[controlId] = new firebase.firestore.Timestamp(
                    controlValue.seconds,
                    controlValue.nanoseconds,
                )
            } else {
                alreadyMappedControlValues[controlId] = controlValue;
            }

            return alreadyMappedControlValues;
        }, {});


        return {
            ...documentReference.data(),
            controlValues: mappedControlValues,
            created: new firebase.firestore.Timestamp(createdFromRequest.seconds, createdFromRequest.nanoseconds),
            id: caseId,
        } as ICase;
    }

    public async uploadFile(companyId: string, caseId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot> {
        const storageRef = firebase.storage().ref();
        const uniqueFolderId = generateUniqueId();
        const updatedStorageRef = storageRef.child(`${companyId}/caseFiles/${caseId}/${uniqueFolderId}/${file.name}`);
        const uploadTaskSnapshot: firebase.storage.UploadTaskSnapshot = await updatedStorageRef.put(file);

        return uploadTaskSnapshot;
    }

    public async removeFile(fileName: string): Promise<void> {
        const storageRef = firebase.storage().ref(fileName);
        await storageRef.delete();
    }

    public updateProject(companyId: string, project: ICase): ICase {
        throw new Error("Method not implemented");
    }

    public async updateCaseInformation(caseId: string, updateCaseInformationRequest: IUpdateCaseInformationRequest, showNewInfoFrom: ShowNewInfoFromType): Promise<void> {
        const caseInformation = {
            controlValues: updateCaseInformationRequest.controlValues,
            showNewInfoFrom,
        }
        await firebase.firestore().collection(Collections.Case).doc(caseId)
            .set(caseInformation, { merge: true });
    }

    public async getNewCases(companyId: string): Promise<ICase[]> {
        const casesQuerySnapshot = await firebase.firestore().collection(Collections.Case)
            .where('companyId', '==', companyId)
            .where('hasStarted', '==', false)
            .orderBy('name', 'asc')
            .get();

        return casesQuerySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            } as ICase;
        });
    }

    public async updateCaseCheckpoints(caseId: string, caseCheckpoints: ICaseCheckpoint[]) {
        await firebase.firestore().collection(Collections.Case).doc(caseId).set({
            caseCheckpoints,
        }, { merge: true });

        return true;
    }

    public async markProjectUpdatesAsSeen(companyId: string, caseId: string): Promise<void> {
        await firebase.firestore().collection(Collections.Case).doc(caseId).set({
            showNewInfoFrom: null,
        }, { merge: true });
    }

    public async canCreateCases(companyId: string): Promise<boolean> {
        const companySnapshot = await firebase.firestore().collection(Collections.Company).doc(companyId).get();

        const companyData = companySnapshot.data()!;
        const hasDoctors = companyData.roleCount[UserType.Doctor] > 0;
        const hasWorkflowCheckpoints = companyData.workflowCheckpointsCount > 0;
        const hasSufficientFieldsOnTemplate = companyData.prescriptionTemplateHasSufficientFields;

        return hasDoctors && hasWorkflowCheckpoints && hasSufficientFieldsOnTemplate;
    }

}