import { Button, Typography, withTheme } from '@material-ui/core';
import * as React from 'react';
import { withRouter } from 'react-router';
import { Logo } from 'src/Components/Logo/Logo';
import { createPrivacyPolicyClasses, IPrivacyPolicyProps, IPrivacyPolicyState } from './PrivacyPolicy.ias';

export class PrivacyPolicyPresentation extends React.Component<IPrivacyPolicyProps, IPrivacyPolicyState> {
    public render() {
        const {
            privacyPolicyContainer,
            logoContainer,
            backToHomeContainer,
            privacyPolicyContent,
            title,
            paragraph,
            contactUsSpan,
        } = createPrivacyPolicyClasses(this.props, this.state);

        return(
            <div className={privacyPolicyContainer}>
                <div className={logoContainer}>
                    <Logo color="blue" width={150}/>
                </div>
                <div className={backToHomeContainer}>
                    <Button color="secondary" variant="contained" onClick={this.navigateToHomePage}>Home</Button>
                </div>
                <div className={privacyPolicyContent}>
                    <Typography variant="h3" className={title}>Privacy Policy</Typography>
                    <Typography variant="body1" className={paragraph}>
                        Shentaro built the Shentaro app as a Commercial app. This SERVICE is provided by Shentaro and is intended for use as is.
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Shentaro unless otherwise defined in this Privacy Policy.
                    </Typography>
                    <Typography variant="subtitle2" className={paragraph}>
                        Information Collection and Use
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Email, First Name, Last Name, Address. The information that we request will be retained by us and used as described in this privacy policy.
                        Information Collection and Use
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        The app does use third party services that may collect information used to identify you.
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        Link to privacy policy of third party service providers used by the app
                    </Typography>
                    <Typography variant="subtitle2" className={paragraph}>
                        Log Data
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
                    </Typography>
                    <Typography variant="subtitle2" className={paragraph}>
                        Cookies
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.
                    </Typography>
                    <Typography variant="subtitle2" className={paragraph}>
                        Service Providers
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        We may employ third-party companies and individuals due to the following reasons:
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        To facilitate our Service;
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        To provide the Service on our behalf;
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        To perform Service-related services; or
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        To assist us in analyzing how our Service is used.
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
                    </Typography>
                    <Typography variant="subtitle2" className={paragraph}>
                        Security
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                    </Typography>
                    <Typography variant="subtitle2" className={paragraph}>
                        Links to Other Sites
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                    </Typography>
                    <Typography variant="subtitle2" className={paragraph}>
                        Children’s Privacy
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
                    </Typography>
                    <Typography variant="subtitle2" className={paragraph}>
                        Changes to This Privacy Policy
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.
                    </Typography>
                    <Typography variant="subtitle2" className={paragraph}>
                        Contact Us
                    </Typography>
                    <Typography variant="body1" className={paragraph}>
                        If you have any questions or suggestions about our Privacy Policy, do not hesitate to <span onClick={this.navigateToContactUs} className={contactUsSpan}>contact us</span>.
                    </Typography>
                </div>
            </div>
        )
    }

    private navigateToHomePage = (): void => {
        this.props.history.push('');
    }

    private navigateToContactUs = (): void => {
        this.props.history.push('contactUs');
    }
}

export const PrivacyPolicy = withRouter(withTheme()(PrivacyPolicyPresentation));