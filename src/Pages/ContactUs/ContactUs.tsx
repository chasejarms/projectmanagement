import {
    FormControl,
    // FormHelperText,
    Input,
    InputLabel,
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import { FormControlState } from 'src/Classes/formControlState';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { createContactUsClasses, IContactUsProps, IContactUsState } from './ContactUs.ias';

export class ContactUs extends React.Component<IContactUsProps, IContactUsState> {
    // tslint:disable-next-line:variable-name
    public _isMounted: boolean;

    public state: IContactUsState = {
        name: new FormControlState({
            value: '',
        }),
        email: new FormControlState({
            value: '',
        }),
        phoneNumber: new FormControlState({
            value: '',
        }),
        message: new FormControlState({
            value: '',
        }),
    }

    public componentWillMount = () => {
        this._isMounted = true;
    }

    public componentWillUnmount = () => {
        this._isMounted = false;
    }

    public render() {
        const {
            pageContainer,
            formContainer,
            submitButtonContainer,
        } = createContactUsClasses(this.props, this.state);

        return (
            <div className={pageContainer}>
                <div className={formContainer}>
                    <Typography variant="h4">
                        Contact Us
                    </Typography>
                    <Typography variant="subtitle1">Have a question or want to get involved in our early-access beta program? Drop us a line below. We try to respond to all messages within 1 business day.</Typography>
                    <FormControl required={true} error={this.state.name.shouldShowError()}>
                        <InputLabel>Name</InputLabel>
                        <Input
                            name="name"
                            value={this.state.name.value}
                            onChange={this.handleFormControlChange}
                        />
                        {/* <FormHelperText>{emailError}</FormHelperText> */}
                    </FormControl>
                    <FormControl required={true} error={this.state.email.shouldShowError()}>
                        <InputLabel>Email</InputLabel>
                        <Input
                            name="email"
                            value={this.state.email.value}
                            onChange={this.handleFormControlChange}
                        />
                        {/* <FormHelperText>{emailError}</FormHelperText> */}
                    </FormControl>
                    <FormControl required={true} error={this.state.phoneNumber.shouldShowError()}>
                        <InputLabel>Phone Number</InputLabel>
                        <Input
                            name="phoneNumber"
                            value={this.state.phoneNumber.value}
                            onChange={this.handleFormControlChange}
                        />
                        {/* <FormHelperText>{emailError}</FormHelperText> */}
                    </FormControl>
                    <FormControl required={true} error={this.state.message.shouldShowError()}>
                        <InputLabel>Message</InputLabel>
                        <Input
                            name="message"
                            multiline={true}
                            value={this.state.message.value}
                            onChange={this.handleFormControlChange}
                        />
                        {/* <FormHelperText>{emailError}</FormHelperText> */}
                    </FormControl>
                    <div className={submitButtonContainer}>
                        <AsyncButton onClick={this.submitMessage} color="primary">
                            Submit
                        </AsyncButton>
                    </div>
                </div>
            </div>
        )
    }

    private handleFormControlChange = (event: any): void => {
        const formControl: FormControlState<string> = this.state[event.target.name];
        const controlToSetOnState = formControl.setValue(event.target.value);
        const name: 'name' | 'email' | 'phoneNumber' | 'message' = event.target.name;

        if (this._isMounted) {
            this.setState({
                [name]: controlToSetOnState,
            } as any);
        }
    }

    private submitMessage = () => {
        //
    }
}