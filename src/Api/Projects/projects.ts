import * as firebase from 'firebase';
import { db } from 'src/firebase';
import { IAugmentedCheckpoint } from 'src/Models/augmentedCheckpoint';
import { ICase } from './../../Models/case';
// import { ISlimCase } from './../../Models/slimCase';
import { ICaseApi, ICaseCreateRequest, IGetCaseCheckpointsRequest, ISlimCasesSearchRequest, IUpdateCaseInformationRequest } from './projectsInterface';

export class ProjectsApi implements ICaseApi {
    public async getSlimCases(slimCasesSearchRequest: ISlimCasesSearchRequest, userType: string, userId: string): Promise<FirebaseFirestore.QueryDocumentSnapshot[]> {
        let query: any = db.collection('slimCases')
            .where('companyId', '==', slimCasesSearchRequest.companyId)
            .orderBy('deadline', 'asc')

        if (userType === 'Customer') {
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

        return {
            ...documentReference.data(),
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
        await firebase.firestore().collection('cases').doc(caseId)
            .set(updateCaseInformationRequest, { merge: true });
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

}