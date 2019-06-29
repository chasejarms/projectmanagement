import { RouteComponentProps } from "react-router";
import useRouter from "./useRouter";

export function useCaseId() {
    const router: RouteComponentProps<any> = useRouter();
    const caseId = router.location.pathname.split('/')[4];
    return caseId;
}