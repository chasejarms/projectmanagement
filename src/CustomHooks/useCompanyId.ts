import { RouteComponentProps } from "react-router";
import useRouter from "./useRouter";

export function useCompanyId() {
    const router: RouteComponentProps<any> = useRouter();
    const companyId = router.location.pathname.split('/')[2];
    return companyId;
}