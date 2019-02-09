import { IUnitedStatesState } from './unitedStatesState';

export interface IUnitedStatesAddress {
    street: string;
    city: string;
    state: IUnitedStatesState;
    zip: string;
}