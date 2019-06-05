import {
    Button,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    Snackbar,
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import { withRouter } from 'react-router';
import { FormControlState } from 'src/Classes/formControlState';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { emailValidator } from 'src/Validators/email.validator';
import { requiredValidator } from 'src/Validators/required.validator';
import Api from '../../Api/api';
import { Logo } from '../../Components/Logo/Logo';
import { createContactUsClasses, IContactUsProps, IContactUsState } from './ContactUs.ias';

export class ContactUsPresentation extends React.Component<IContactUsProps, IContactUsState> {
    // tslint:disable-next-line:variable-name
    public _isMounted: boolean;

    public state: IContactUsState = {
        name: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A name is required'),
            ]
        }).markAsInvalid(),
        email: new FormControlState({
            value: '',
            validators: [
                requiredValidator('An email is required'),
                emailValidator,
            ],
        }).markAsInvalid(),
        phoneNumber: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A phone number is required'),
            ],
        }).markAsInvalid(),
        message: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A message is required'),
            ],
        }).markAsInvalid(),
        contactUsInProgress: false,
        snackbarIsOpen: false,
        contactUsSuccess: true,
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
            logoContainer,
            homeButtonContainer,
        } = createContactUsClasses(this.props, this.state);

        const {
            name,
            email,
            phoneNumber,
            message,
        } = this.state;

        const nameError = name.shouldShowError() ? name.errors[0] : undefined;
        const emailError = email.shouldShowError() ? email.errors[0] : undefined;
        const phoneNumberError = phoneNumber.shouldShowError() ? phoneNumber.errors[0] : undefined;
        const messageError = message.shouldShowError() ? message.errors[0] : undefined;

        return (
            <div className={pageContainer}>
                <div className={logoContainer}>
                    <Logo color="blue" width={150}/>
                </div>
                <div className={homeButtonContainer}>
                    <Button color="secondary" variant="contained" onClick={this.navigateToHome}>Home</Button>
                </div>
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
                        <FormHelperText>{nameError}</FormHelperText>
                    </FormControl>
                    <FormControl required={true} error={this.state.email.shouldShowError()}>
                        <InputLabel>Email</InputLabel>
                        <Input
                            name="email"
                            value={this.state.email.value}
                            onChange={this.handleFormControlChange}
                        />
                        <FormHelperText>{emailError}</FormHelperText>
                    </FormControl>
                    <FormControl required={true} error={this.state.phoneNumber.shouldShowError()}>
                        <InputLabel>Phone Number</InputLabel>
                        <Input
                            name="phoneNumber"
                            value={this.state.phoneNumber.value}
                            onChange={this.handleFormControlChange}
                        />
                        <FormHelperText>{phoneNumberError}</FormHelperText>
                    </FormControl>
                    <FormControl required={true} error={this.state.message.shouldShowError()}>
                        <InputLabel>Message</InputLabel>
                        <Input
                            name="message"
                            multiline={true}
                            value={this.state.message.value}
                            onChange={this.handleFormControlChange}
                        />
                        <FormHelperText>{messageError}</FormHelperText>
                    </FormControl>
                    <div className={submitButtonContainer}>
                        <AsyncButton
                            onClick={this.submitMessage}
                            color="primary"
                            disabled={!this.allControlsAreValid() || this.state.contactUsInProgress}
                            asyncActionInProgress={this.state.contactUsInProgress}>
                            Submit
                        </AsyncButton>
                    </div>
                    <Snackbar
                        open={this.state.snackbarIsOpen}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        autoHideDuration={5000}
                        message={
                            (
                                <span>
                                    {this.state.contactUsSuccess ? (
                                        'Success! We\'ll get back to you soon'
                                    ): (
                                        'Oops! It looks like there was an error. Try back again later'
                                    )}
                                </span>
                            )
                        }
                        onClose={this.handleSnackbarClose}
                    />
                </div>
            </div>
        )
    }

    private handleSnackbarClose = () => {
        if (this._isMounted) {
            this.setState({
                snackbarIsOpen: false,
            })
        }
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

    private allControlsAreValid(): boolean {
        const {
            name,
            email,
            phoneNumber,
            message,
        } = this.state;

        return !name.invalid && !email.invalid && !phoneNumber.invalid && !message.invalid;
    }

    private submitMessage = async() => {
        if (this._isMounted) {
            this.setState({
                contactUsInProgress: true,
            })
        }

        const {
            name,
            email,
            phoneNumber,
            message,
        } = this.state;

        const contactUsRequest = {
            name: name.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            message: message.value,
        }

        try {
            await Api.contactUsApi.contactUs(contactUsRequest);
        } catch (e) {
            this.setState({
                snackbarIsOpen: true,
                contactUsInProgress: false,
                contactUsSuccess: false,
            })
            return;
        }

        this.setState({
            snackbarIsOpen: true,
            contactUsInProgress: false,
            contactUsSuccess: true,
            name: name.setValue('')
                .markAsBrandNew()
                .markAsInvalid(),
            email: email.setValue('')
                .markAsBrandNew()
                .markAsInvalid(),
            phoneNumber: phoneNumber.setValue('')
                .markAsBrandNew()
                .markAsInvalid(),
            message: message.setValue('')
                .markAsBrandNew()
                .markAsInvalid(),
        })
    }

    private navigateToHome = (): void => {
        this.props.history.push('');
    }
}

export const ContactUs = withRouter(ContactUsPresentation);