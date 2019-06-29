import { useSelector } from "react-redux";
import { IAppState } from "src/Redux/Reducers/rootReducer";

export function useExistingCaseSliceOfState() {
    return useSelector((state: IAppState) => {
        return state.existingCaseState;
    });
}