import { useSelector } from "react-redux";
import { IAppState } from "src/Redux/Reducers/rootReducer";

export function useUserState() {
    return useSelector((state: IAppState) => {
        return state.userState;
    });
}