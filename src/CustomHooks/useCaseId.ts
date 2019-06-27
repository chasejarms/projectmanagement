import { useRouter } from 'src/App';

export const useCaseId = () => {
    const router = useRouter();
    // tslint:disable-next-line:no-console
    console.log(router);
}