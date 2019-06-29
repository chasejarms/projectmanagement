import {useContext} from "react"
import { RouteComponentProps } from "react-router";
import { RouterContext } from "src/Components/CustomBrowserRouter/CustomBrowserRouter";

export default function useRouter() {
  return useContext(RouterContext) as RouteComponentProps<any>;
}