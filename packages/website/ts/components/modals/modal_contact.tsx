import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { CheckBoxInput, Input, InputWidth, OptionSelector } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';
import { GlobalStyle } from 'ts/constants/globalStyle';
import { utils } from 'ts/utils/utils';

export enum ModalContactType {
    General = 'GENERAL',
    MarketMaker = 'MARKET_MAKER',
    Credits = 'CREDITS',
}

interface ServiceOptionMetadata {
    label: string;
    name: string;
}
const CREDIT_SERVICES_OPTIONS: ServiceOptionMetadata[] = [
    {
        label: 'AWS',
        name: 'aws',
    },
    {
        label: 'Facebook Ads',
        name: 'facebook_ads',
    },
    {
        label: 'Alchemy',
        name: 'alchemy',
    },
    {
        label: 'Digital Ocean',
        name: 'digital_ocean',
    },
];

interface Props {
    theme?: GlobalStyle;
    isOpen?: boolean;
    onDismiss?: () => void;
    modalContactType: ModalContactType;
}

interface FormProps {
    isSuccessful?: boolean;
    isSubmitting?: boolean;
}

interface ErrorResponseProps {
    param: string;
    location: string;
    msg: string;
}

interface ErrorResponse {
    errors: ErrorResponseProps[];
}

interface ErrorProps {
    [key: string]: string;
}

export class ModalContact extends React.Component<Props> {
    public static defaultProps = {
        modalContactType: ModalContactType.General,
    };
    public state = {
        creditLeadsServices: [] as string[],
        isSubmitting: false,
        isSuccessful: false,
        errors: {},
    };
    // shared fields
    public nameRef: React.RefObject<HTMLInputElement> = React.createRef();
    public emailRef: React.RefObject<HTMLInputElement> = React.createRef();
    public companyProjectRef: React.RefObject<HTMLInputElement> = React.createRef();
    public commentsRef: React.RefObject<HTMLInputElement> = React.createRef();
    // general lead fields
    public linkRef: React.RefObject<HTMLInputElement> = React.createRef();
    // market maker lead fields
    public countryRef: React.RefObject<HTMLInputElement> = React.createRef();
    public fundSizeRef: React.RefObject<HTMLInputElement> = React.createRef();

    public constructor(props: Props) {
        super(props);
    }
    public render(): React.ReactNode {
        const { isOpen, onDismiss } = this.props;
        const { isSuccessful, errors } = this.state;
        return (
            <>
                <DialogOverlay
                    style={{ background: 'rgba(0, 0, 0, 0.75)', zIndex: 30 }}
                    isOpen={isOpen}
                    onDismiss={onDismiss}
                >
                    <StyledDialogContent>
                        <Form onSubmit={this._onSubmitAsync.bind(this)} isSuccessful={isSuccessful}>
                            <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                                Contact the 0x Core Team
                            </Heading>
                            {this._renderFormContent(errors)}
                            <ButtonRow>
                                <Button
                                    color="#5C5C5C"
                                    isNoBorder={true}
                                    isTransparent={true}
                                    type="button"
                                    onClick={this.props.onDismiss}
                                >
                                    Back
                                </Button>
                                <Button>Submit</Button>
                            </ButtonRow>
                        </Form>
                        <Confirmation isSuccessful={isSuccessful}>
                            <Icon name="rocketship" size="large" margin={[0, 0, 'default', 0]} />
                            <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                                Thanks for contacting us.
                            </Heading>
                            <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                                We'll get back to you soon. If you need quick support in the meantime, reach out to the
                                0x team on Discord.
                            </Paragraph>
                            <Button onClick={this.props.onDismiss}>Done</Button>
                        </Confirmation>
                    </StyledDialogContent>
                </DialogOverlay>
            </>
        );
    }
    public _renderFormContent(errors: ErrorProps): React.ReactNode {
        switch (this.props.modalContactType) {
            case ModalContactType.MarketMaker:
                return this._renderMarketMakerFormContent(errors);
            case ModalContactType.Credits:
                return this._remderCreditsFormContent(errors);
            case ModalContactType.General:
            default:
                return this._renderGeneralFormContent(errors);
        }
    }
    private _renderMarketMakerFormContent(errors: ErrorProps): React.ReactNode {
        return (
            <>
                <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                    If you’re considering market making on 0x, we’re happy to answer your questions. Fill out the form
                    so we can connect you with the right person to help you get started.
                </Paragraph>
                <InputRow>
                    <Input
                        name="name"
                        label="Your name"
                        type="text"
                        width={InputWidth.Half}
                        ref={this.nameRef}
                        required={true}
                        errors={errors}
                    />
                    <Input
                        name="email"
                        label="Your email"
                        type="email"
                        ref={this.emailRef}
                        required={true}
                        errors={errors}
                        width={InputWidth.Half}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="country"
                        label="Country of Location"
                        type="text"
                        ref={this.countryRef}
                        required={true}
                        errors={errors}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="fundSize"
                        label="Fund Size"
                        type="text"
                        ref={this.fundSizeRef}
                        required={true}
                        errors={errors}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="companyOrProject"
                        label="Name of your project / company"
                        type="text"
                        ref={this.companyProjectRef}
                        required={false}
                        errors={errors}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="comments"
                        label="What is prompting you to reach out?"
                        type="textarea"
                        ref={this.commentsRef}
                        required={false}
                        errors={errors}
                    />
                </InputRow>
            </>
        );
    }

    private _remderCreditsFormContent(errors: ErrorProps): React.ReactNode {
        return (
            <>
                <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                    If you are building on top of 0x full time, please fill out this form and our Relayer Success
                    Manager will be in touch.
                </Paragraph>
                <InputRow>
                    <Input
                        name="name"
                        label="Your name"
                        type="text"
                        width={InputWidth.Half}
                        ref={this.nameRef}
                        required={true}
                        errors={errors}
                    />
                    <Input
                        name="email"
                        label="Your email"
                        type="email"
                        ref={this.emailRef}
                        required={true}
                        errors={errors}
                        width={InputWidth.Half}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="companyOrProject"
                        label="Name of your project / company"
                        type="text"
                        ref={this.companyProjectRef}
                        required={false}
                        errors={errors}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="comments"
                        label="Brief Project Description."
                        type="textarea"
                        ref={this.commentsRef}
                        required={false}
                        errors={errors}
                    />
                </InputRow>
                <InputRow>
                    <OptionSelector
                        isFlex={true}
                        name="services"
                        label="Which credits are you interested in?"
                        errors={errors}
                    >
                        {CREDIT_SERVICES_OPTIONS.map((metadata: ServiceOptionMetadata) => {
                            return (
                                <CheckBoxInput
                                    onClick={this._handleCheckBoxInput.bind(this, metadata.name)}
                                    key={`checkbox-${metadata.name}`}
                                    isSelected={_.includes(this.state.creditLeadsServices, metadata.name)}
                                    label={metadata.label}
                                />
                            );
                        })}
                    </OptionSelector>
                </InputRow>
            </>
        );
    }

    private _handleCheckBoxInput(checkBoxName: string): void {
        const newCreditLeadsServices = _.includes(this.state.creditLeadsServices, checkBoxName)
            ? _.pull(this.state.creditLeadsServices, checkBoxName)
            : _.concat(this.state.creditLeadsServices, checkBoxName);
        this.setState({ creditLeadsServices: newCreditLeadsServices });
    }

    private _renderGeneralFormContent(errors: ErrorProps): React.ReactNode {
        return (
            <>
                <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                    If you're considering building on 0x, we're happy to answer your questions. Fill out the form so we
                    can connect you with the right person to help you get started.
                </Paragraph>
                <InputRow>
                    <Input
                        name="name"
                        label="Your name"
                        type="text"
                        width={InputWidth.Half}
                        ref={this.nameRef}
                        required={true}
                        errors={errors}
                    />
                    <Input
                        name="email"
                        label="Your email"
                        type="email"
                        ref={this.emailRef}
                        required={true}
                        errors={errors}
                        width={InputWidth.Half}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="companyOrProject"
                        label="Name of your project / company"
                        type="text"
                        ref={this.companyProjectRef}
                        required={true}
                        errors={errors}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="link"
                        label="Do you have any documentation or a website?"
                        type="text"
                        ref={this.linkRef}
                        errors={errors}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="comments"
                        label="Anything else?"
                        type="textarea"
                        ref={this.commentsRef}
                        errors={errors}
                    />
                </InputRow>
            </>
        );
    }
    private async _onSubmitAsync(e: Event): Promise<void> {
        e.preventDefault();

        let jsonBody;
        if (this.props.modalContactType === ModalContactType.MarketMaker) {
            jsonBody = {
                name: this.nameRef.current.value,
                email: this.emailRef.current.value,
                country: this.countryRef.current.value,
                fundSize: this.fundSizeRef.current.value,
                projectOrCompany: this.companyProjectRef.current.value,
                comments: this.commentsRef.current.value,
            };
        } else if (this.props.modalContactType === ModalContactType.Credits) {
            jsonBody = {
                name: this.nameRef.current.value,
                email: this.emailRef.current.value,
                projectOrCompany: this.companyProjectRef.current.value,
                comments: this.commentsRef.current.value,
                services: this.state.creditLeadsServices,
            };
        } else {
            jsonBody = {
                name: this.nameRef.current.value,
                email: this.emailRef.current.value,
                projectOrCompany: this.companyProjectRef.current.value,
                link: this.linkRef.current.value,
                comments: this.commentsRef.current.value,
            };
        }

        this.setState({ ...this.state, errors: [], isSubmitting: true });

        let endpoint;
        switch (this.props.modalContactType) {
            case ModalContactType.Credits:
                endpoint = '/credit_leads';
                break;
            case ModalContactType.MarketMaker:
                endpoint = '/market_maker_leads';
                break;
            default:
                endpoint = '/leads';
        }

        try {
            // Disabling no-unbound method b/c no reason for _.isEmpty to be bound
            // tslint:disable:no-unbound-method
            const response = await fetch(`${utils.getBackendBaseUrl()}${endpoint}`, {
                method: 'post',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(_.omitBy(jsonBody, _.isEmpty)),
            });

            if (!response.ok) {
                const errorResponse: ErrorResponse = await response.json();
                const errors = this._parseErrors(errorResponse.errors);
                this.setState({ ...this.state, isSubmitting: false, errors });

                throw new Error('Request failed');
            }

            this.setState({ ...this.state, isSuccessful: true });
        } catch (e) {
            // Empty block
        }
    }
    private _parseErrors(errors: ErrorResponseProps[]): ErrorProps {
        const initialValue: {} = {};
        return _.reduce(
            errors,
            (hash: ErrorProps, error: ErrorResponseProps) => {
                const { param, msg } = error;
                const key = param;
                hash[key] = msg;

                return hash;
            },
            initialValue,
        );
    }
}

// Handle errors: {"errors":[{"location":"body","param":"name","msg":"Invalid value"},{"location":"body","param":"email","msg":"Invalid value"}]}

const InputRow = styled.div`
    width: 100%;
    flex: 0 0 auto;

    @media (min-width: 768px) {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }
`;

const ButtonRow = styled(InputRow)`
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;

        button:nth-child(1) {
            order: 2;
        }

        button:nth-child(2) {
            order: 1;
            margin-bottom: 10px;
        }
    }
`;

const StyledDialogContent = styled(DialogContent)`
    position: relative;
    max-width: 800px;
    background-color: #f6f6f6 !important;
    padding: 60px 60px !important;

    @media (max-width: 768px) {
        width: calc(100vw - 40px) !important;
        margin: 40px auto !important;
        padding: 30px 30px !important;
    }
`;

const Form = styled.form<FormProps>`
    position: relative;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

    opacity: ${props => props.isSuccessful && `0`};
    visibility: ${props => props.isSuccessful && `hidden`};
`;

const Confirmation = styled.div<FormProps>`
    position: absolute;
    top: 50%;
    text-align: center;
    width: 100%;
    left: 0;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    transition-delay: 0.4s;
    padding: 60px 60px;
    transform: translateY(-50%);
    opacity: ${props => (props.isSuccessful ? `1` : `0`)};
    visibility: ${props => (props.isSuccessful ? 'visible' : `hidden`)};

    p {
        max-width: 492px;
        margin-left: auto;
        margin-right: auto;
    }
`;
