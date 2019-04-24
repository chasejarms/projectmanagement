import * as firebase from 'firebase';
import { db } from 'src/firebase';
import { IAugmentedCheckpoint } from 'src/Models/augmentedCheckpoint';
import { UserType } from 'src/Models/userTypes';
import { ShowNewInfoFromType } from './../../../functions/src/models/showNewInfoFromTypes';
import { ICase } from './../../Models/case';
// import { ISlimCase } from './../../Models/slimCase';
import { ICaseApi, ICaseCreateRequest, IGetCaseCheckpointsRequest, ISlimCasesSearchRequest, IUpdateCaseInformationRequest } from './projectsInterface';

export class ProjectsApi implements ICaseApi {
    public async getSlimCases(slimCasesSearchRequest: ISlimCasesSearchRequest, userType: string, userId: string): Promise<FirebaseFirestore.QueryDocumentSnapshot[]> {
        let query: any = db.collection('slimCases')
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
            .collection('cases')
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
        const updatedStorageRef = storageRef.child(`${companyId}/caseFiles/${caseId}/${file.name}`);
        const uploadTaskSnapshot: firebase.storage.UploadTaskSnapshot = await updatedStorageRef.put(file);

        return uploadTaskSnapshot;
    }

    public async removeFile(fileName: string): Promise<void> {
        const storageRef = firebase.storage().ref(fileName);
        await storageRef.delete();
    }

    public async getProjectCheckpoints(getCaseCheckpointsRequest: IGetCaseCheckpointsRequest): Promise<IAugmentedCheckpoint[]> {
        const getCaseCheckpointsCloudFunction = firebase.functions().httpsCallable('getCaseCheckpoints');
        const getCaseCheckpointsResponse = await getCaseCheckpointsCloudFunction(getCaseCheckpointsRequest);
        return getCaseCheckpointsResponse.data;
    }

    public updateProject(companyId: string, project: ICase): ICase {
        throw new Error("Method not implemented");
    }

    public async updateCaseInformation(caseId: string, updateCaseInformationRequest: IUpdateCaseInformationRequest, showNewInfoFrom: ShowNewInfoFromType): Promise<void> {
        const caseInformation = {
            controlValues: updateCaseInformationRequest.controlValues,
            showNewInfoFrom,
        }
        await firebase.firestore().collection('cases').doc(caseId)
            .set(caseInformation, { merge: true });
    }

    public async getNewCases(companyId: string): Promise<ICase[]> {
        const casesQuerySnapshot = await firebase.firestore().collection('cases')
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

    public async updateCaseCheckpoint(checkpointId: string, complete: boolean, completedBy: string | null, completedByName: string | null): Promise<boolean> {
        await firebase.firestore().collection('caseCheckpoints')
            .doc(checkpointId)
            .set({
                complete,
                completedBy,
                completedByName,
            }, { merge: true })

        return true;
    }

    public async markProjectUpdatesAsSeen(companyId: string, caseId: string): Promise<void> {
        await firebase.firestore().collection('cases').doc(caseId).set({
            showNewInfoFrom: null,
        }, { merge: true });
    }

    public async canCreateCases(companyId: string): Promise<boolean> {
        const canCreateCasesCloudFunction = firebase.functions().httpsCallable('canCreateCases');

        const createCaseResponse = await canCreateCasesCloudFunction({
            companyId,
        });

        return createCaseResponse.data;
    }

}