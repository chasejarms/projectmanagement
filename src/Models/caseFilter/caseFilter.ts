import { CheckpointFlag } from "./checkpointFlag";
import { CompletionStatus } from "./completionStatus";
import { DoctorFlag } from "./doctorFlag";
import { NotificationFlag } from "./notificationFlag";
import { StartedStatus } from "./startedStatus";

export interface ICaseFilter {
    completionStatus: CompletionStatus,
    startedStatus: StartedStatus,
    doctorFlag: DoctorFlag,
    /**
     * only present if the doctor flag indicates a specific doctor
     */
    doctorId?: string,
    checkpointFlag: CheckpointFlag,
    /**
     * only present if the checkpoint flag indicates specific checkpoints
     */
    checkpointIds?: string[],
    notificationFlag: NotificationFlag,
}