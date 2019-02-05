import * as firebase from 'firebase';
import { db } from 'src/firebase';
import { IAugmentedCheckpoint } from 'src/Models/augmentedCheckpoint';
import { UserType } from 'src/Models/userTypes';
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
        try {
            createCaseResponse = await createCaseCloudFunction(projectCreateRequest);
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
        const deadlineFromRequest = documentReference.data()!.deadline as firebase.firestore.Timestamp;


        return {
            ...documentReference.data(),
            created: new firebase.firestore.Timestamp(createdFromRequest.seconds, createdFromRequest.nanoseconds),
            deadline: new firebase.firestore.Timestamp(deadlineFromRequest.seconds, deadlineFromRequest.nanoseconds),
            id: caseId,
        } as ICase;
    }

    public async uploadFile(companyId: string, caseId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot> {
        const storageRef = firebase.storage().ref();
        const updatedStorageRef = storageRef.child(`${companyId}/${caseId}/${file.name}`);
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

    public async updateCaseInformation(caseId: string, updateCaseInformationRequest: IUpdateCaseInformationRequest): Promise<void> {
        const deadlineAsDate = new Date(updateCaseInformationRequest.deadline);
        const deadlineAsTimestamp = new firebase.firestore.Timestamp(Math.round(deadlineAsDate.getTime() / 1000), 0);
        const caseInformation = {
            ...updateCaseInformationRequest,
            deadline: deadlineAsTimestamp,
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

    public async updateCaseCheckpoint(checkpointId: string, complete: boolean, completedBy?: string): Promise<boolean> {
        await firebase.firestore().collection('caseCheckpoints')
            .doc(checkpointId)
            .set({
                complete,
                completedBy: completedBy || null,
            }, { merge: true })

        return true;
    }

}