"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"; 
import Tabs from "../components/tabs"
import styled from "styled-components"
import ProtectedRoute from '../components/protectedPage';
import { signIn } from "next-auth/react";  


const Page = styled.div`
    width: 100%;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    row-gap: 2.5vh;
    box-sizing: border-box;
    padding: 2.5vh 10vw;
    font-family: ${p => p.theme.font.content};
    color: ${p => p.theme.color.default};
`

const Headings = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`

const Heading = styled.h1`
    font-size: 1.75em;
    font-weight: ${p => p.theme.weight.bold};
    font-family: ${p => p.theme.font.heading};
`

const Subheading = styled.h3`
    font-size: 1.25em;
    font-weight: ${p => p.theme.weight.semibold};
`

const Content = styled.div`
    flex-grow: 1;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    column-gap: 5vh;
    box-sizing: border-box;
    padding: 5vh 0;
`

const FormStyled = styled.form`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    row-gap: 1vh;
    margin: 0 10%;
    font-size: 1rem;
`

const InputStyled = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    ${props => props.error && `
        border-color: red;
        background-color: #ffdddd;
    `}
`

const TextareaStyled = styled.textarea`
    flex-basis: 1;
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none;
    ${props => props.error && `
        border-color: red;
        background-color: #ffdddd;
    `}
`

const SubmitButton = styled.button`
    align-self: center;
    padding: 0.5rem 1rem;
    border: 3px solid #8A8A8A; 
    border-radius: 8px;
    margin: 2vh 0;
    font-size: 1.125rem;
    font-weight: ${p => p.theme.weight.semibold};
    background-color: ${p => p.theme.background.grey};
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25);
    transition: background-color ${p => p.theme.transition.default};
    &:hover { background-color: ${p => p.theme.background.hover.light}; }
    &:active { background-color: ${p => p.theme.background.active}; }
`;

const ImageContainer = styled.div`
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        width: 100%;
        height: auto;
    }
`

const StudentAccountView = () => {
    const [name, setName] = useState("");
    const [calpoly_email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();  

    // Validate form fields
    const validateForm = () => {
        const newErrors: any = {};
      
        if (!name) newErrors.username = "Name is required.";
        if (!calpoly_email) newErrors.email = "Email is required.";
        if (!password) newErrors.password = "Password is required.";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
        if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password.";

        setErrors(newErrors);

        // Return false if there are any errors, else true
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Perform validation before submitting
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('/api/signupstudent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  display_name: name,
                  email: calpoly_email,
                  password,
                  confirmPassword
                }),
            });

            if (response.ok) {
                const loginResponse = await signIn('credentials', {
                    calpoly_email,
                    password,
                    redirect: false  
                });

                if (loginResponse?.ok) {
                    router.push('/');
                } else {
                    console.error("Login failed", loginResponse?.error);
                }
            } else {
                const errorData = await response.json();
                if (response.status === 409) {
                	setErrors(prev => ({ ...prev, email: errorData.error }));
              } else {
                console.error("Error:", errorData.error);
            	}
			}
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <>
            <Headings>
                <Heading>sign up for a student account</Heading>
                <Subheading>create an account to comment and contribute to our platform!</Subheading>
            </Headings>
            <Content>
                <FormStyled onSubmit={handleSubmit}>
                    <InputStyled
                        type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.username}
                    />
                    {errors.username && <div style={{ color: 'red' }}>{errors.username}</div>}
                    
                    <InputStyled
                        type="email"
                        placeholder="cal poly email"
                        value={calpoly_email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}

                    <InputStyled
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                    {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                    
                    <InputStyled
                        type="password"
                        placeholder="confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                    />
                    {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword}</div>}
                    
                    <SubmitButton type="submit">submit!</SubmitButton>
                </FormStyled>
                <ImageContainer>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFtaDwRNQARPlCAkG-N4QXR3QpHUCdz2Rg9A&s" alt="DONUTS" />
                </ImageContainer>
            </Content>
        </>
    );
};

const OrganizationAccountView = () => {
    const [organizationName, setOrganizationName] = useState("");
    const [organizationEmail, setOrganizationEmail] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [description, setDescription] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [coverPhoto, setCoverPhoto] = useState("");
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();  

    // Validate form fields
    const validateForm = () => {
        const newErrors: any = {};
        
        if (!organizationName) newErrors.organizationName = "Organization name is required.";
        if (!organizationEmail) newErrors.organizationEmail = "Email is required.";
        if (!contactPerson) newErrors.contactPerson = "Contact person is required.";
        if (!password) newErrors.password = "Password is required.";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
        if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
        if (!description) newErrors.description = "Description is required.";

        setErrors(newErrors);

        // Return false if there are any errors, else true
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Perform validation before submitting
        if (!validateForm()) {
            return;
        }

        // Proceed with form submission (e.g., call API)
        const formData = {
            organizationName,
            organizationEmail,
            contactPerson,
            password,
            confirmPassword,
            description,
            profilePhoto,
            coverPhoto
        };

        try {
            const response = await fetch('/api/signuporg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const loginResponse = await signIn('credentials', {
                    email: organizationEmail,
                    password,
                    redirect: false  
                });

                if (loginResponse?.ok) {
                    router.push('/');
                } else {
                    console.error("Login failed", loginResponse?.error);
                }
            } else {
                const errorData = await response.json();
                if (response.status === 409) {
                    setErrors(prev => ({ ...prev, organizationEmail: errorData.error }));
                } else {
                    console.error("Error:", errorData.error);
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <>
            <Headings>
                <Heading>Sign up for an Organization Account</Heading>
                <Subheading>Register your organization to manage events and engage with our platform!</Subheading>
            </Headings>
            <Content>
                <FormStyled onSubmit={handleSubmit}>
                    <InputStyled
                        type="text"
                        placeholder="Organization Name"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        error={errors.organizationName}
                    />
                    {errors.organizationName && <div style={{ color: 'red' }}>{errors.organizationName}</div>}
                    
                    <InputStyled
                        type="email"
                        placeholder="Organization Email"
                        value={organizationEmail}
                        onChange={(e) => setOrganizationEmail(e.target.value)}
                        error={errors.organizationEmail}
                    />
                    {errors.organizationEmail && <div style={{ color: 'red' }}>{errors.organizationEmail}</div>}

                    <InputStyled
                        type="text"
                        placeholder="Contact Person"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        error={errors.contactPerson}
                    />
                    {errors.contactPerson && <div style={{ color: 'red' }}>{errors.contactPerson}</div>}

                    <InputStyled
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                    {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                    
                    <InputStyled
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                    />
                    {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword}</div>}
                    
                    <TextareaStyled
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={errors.description}
                    />
                    {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}

                    <SubmitButton type="submit">Submit!</SubmitButton>
                </FormStyled>
                <ImageContainer>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFtaDwRNQARPlCAkG-N4QXR3QpHUCdz2Rg9A&s" alt="Organization" />
                </ImageContainer>
            </Content>
        </>
    );
};

const CreateAccountPage = () => {
    const [view, setView] = useState(0); // 0: student, 1: organization

    return (
        <ProtectedRoute requiredRole="loggedOut">
            <Page>
                <Tabs items={["Student", "Organization"]} selected={view} setSelected={setView} />
                {view ? <OrganizationAccountView /> : <StudentAccountView />}
            </Page>
        </ProtectedRoute>
    );
};

export default CreateAccountPage;