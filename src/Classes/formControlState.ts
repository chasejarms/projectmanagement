import { cloneDeep } from 'lodash';

export interface IFormControlState<T> {
    value: T;
    touched: boolean;
    dirty: boolean;
    invalid: boolean;
    errors: string[];
    createCopy: () => FormControlState<T>;
    setValue: (value: T) => FormControlState<T>;
    markAsTouched: () => FormControlState<T>;
    markAsDirty: () => FormControlState<T>;
    markAsInvalid: () => FormControlState<T>;
    runValidators: () => FormControlState<T>;
    shouldShowError: () => boolean;
}

export type IValidator<T> = (value: T) => string | null;

export interface IFormControlConfig<T> {
    value: T;
    touched?: boolean;
    dirty?: boolean;
    invalid?: boolean;
    validators?: Array<IValidator<T>>;
    errors?: string[];
}

export class FormControlState<T> implements IFormControlState<T> {
    public value: T;
    public touched: boolean;
    public dirty: boolean;
    public invalid: boolean;
    public validators: Array<IValidator<T>>
    public errors: string[];

    constructor({
        value,
        touched,
        dirty,
        invalid,
        validators,
        errors,
    }: IFormControlConfig<T>) {
        this.value = value;
        this.touched = touched === undefined ? false : touched;
        this.dirty = dirty === undefined ? false : dirty;
        this.invalid = invalid === undefined ? false : invalid;
        this.validators = validators === undefined ? [] : cloneDeep(validators);
        this.errors = errors === undefined ? [] : cloneDeep(errors);

        this.createCopy = this.createCopy.bind(this);
        this.setValue = this.setValue.bind(this);
        this.markAsTouched = this.markAsTouched.bind(this);
        this.markAsInvalid = this.markAsInvalid.bind(this);
        this.runValidators = this.runValidators.bind(this);
        this.shouldShowError = this.shouldShowError.bind(this);
        this.runValidatorFn = this.runValidatorFn.bind(this);
    }

    public createCopy(): FormControlState<T> {
        const formControlConfig = {
            value: this.value,
            touched: this.touched,
            dirty: this.dirty,
            invalid: this.invalid,
            validators: this.validators,
            errors: this.errors,
        }

        return new FormControlState(formControlConfig);
    }

    public setValue(value: T): FormControlState<T> {
        this.value = value;
        return this.createCopy()
            .markAsTouched()
            .markAsDirty()
            .runValidators();
    }

    public markAsTouched(): FormControlState<T> {
        this.touched = true;
        return this;
    }

    public markAsDirty(): FormControlState<T> {
        this.dirty = true;
        return this;
    }

    public markAsInvalid(): FormControlState<T> {
        this.invalid = true;
        return this;
    }

    public markAsPristine(): FormControlState<T> {
        this.dirty = false;
        return this;
    }

    public markAsValid(): FormControlState<T> {
        this.invalid = false;
        return this;
    }

    public markAsUntouched(): FormControlState<T> {
        this.touched = false;
        return this;
    }

    public markAsBrandNew(): FormControlState<T> {
        return this.markAsUntouched()
            .markAsValid()
            .markAsPristine();
    }

    public runValidators(): FormControlState<T> {
        if (this.validators.length > 0) {
            this.errors = [];
            const valueIsValid = this.validators.every(this.runValidatorFn);
            this.invalid = !valueIsValid;
        } else {
            this.invalid = false;
        }

        return this;
    }

    public shouldShowError(): boolean {
        return this.invalid && this.touched && this.dirty;
    }

    public setError(errorMessage: string): FormControlState<T> {
        this.errors = [errorMessage];
        return this;
    }

    private runValidatorFn = (validatorFn: IValidator<T>) => {
        const validatorReturnValue = validatorFn(this.value);
        const validatorPassed = validatorReturnValue === null;

        if (!validatorPassed) {
            this.errors.push(validatorReturnValue as string);
        }

        return validatorPassed;
    }
}