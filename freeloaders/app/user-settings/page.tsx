'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../components/modal';
import styled from "styled-components";
import { signOut } from "next-auth/react";
import ProtectedRoute from '../components/protectedPage';
import { useSession } from 'next-auth/react';


type ModalType = 'name' | 'email' | 'password' | 'picture' | null;

const PageContainer = styled.div`
    height: 90vh;
    display: flex;
    flex-direction: row;
    position: relative;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 80%;
    max-width: 1200px;
    padding: 0 2vw;
`;

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 55%;
    padding-right: 2vw;
`;

const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 35%;
    padding-left: 2vw;
`;

const SettingsHeading = styled.h2`
    padding-top: 5vh;
    padding-bottom: 5vh;
    font-size: 2.5rem;
    text-align: center;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.default};
    font-weight: ${p => p.theme.weight.bold};
    width: 100%;
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
`;

const FieldHeading = styled.h3`
    font-size: 1.875rem;
    font-family: ${p => p.theme.font.content};
    color: ${p => p.theme.color.default};
    font-weight: ${p => p.theme.weight.bold};
    margin-bottom: 0.5vh;
`;

const FieldText = styled.p`
    font-size: 1.625rem;
    color: ${p => p.theme.color.default};
    font-family: ${p => p.theme.font.content};
    margin-bottom: 1vh;
`;

const FieldLink = styled.a`
    font-size: 1.25rem;
    font-family: ${p => p.theme.font.content};
    color: ${p => p.theme.color.accent};
    cursor: pointer;
    text-decoration: underline ${p => p.theme.background.white};
    margin-top: 0.5vh;
    transition: text-decoration-color ${p => p.theme.transition.default};
    &:hover { text-decoration-color: ${p => p.theme.color.accent}; }
`;

const ProfileImage = styled.img`
    border-radius: 50%;
    width: 280px;
    height: 280px;
    margin-bottom: 2vh;
`;

// Modal-specific styled components
const InputField = styled.input`
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 1.5rem;
    font-family: ${p => p.theme.font.content};
    color: ${p => p.theme.color.default};
`;

const SaveButton = styled.button`
    box-sizing: border-box;
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    font-weight: ${p => p.theme.weight.bold};
    color: ${p => p.theme.color.default};
    background-color: ${p => p.theme.background.grey};
    border: 4px solid #8A8A8A; 
    border-radius: 8px;
    cursor: pointer;
    font-family: ${p => p.theme.font.content};
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25);
    transition: background-color ${p => p.theme.transition.default};
    &:hover { background-color: ${p => p.theme.background.hover.light}; }
    &:active { background-color: ${p => p.theme.background.active}; }
`;

const LogoutButton = styled.button`
    padding: 0.75rem 1.5rem;
    margin-top: 1rem;
    font-size: 1.125rem;
    font-weight: ${p => p.theme.weight.bold};
    color: ${p => p.theme.color.white};
    background-color: red;
    border: 4px solid #8A8A8A;
    border-radius: 8px;
    cursor: pointer;
    font-family: ${p => p.theme.font.content};
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25); 

    &:hover {
        background-color: #d05050;
    }
`;

const ErrorMessage = styled.p`
    font-size: 1.25rem;
    color: red;
    font-family: ${p => p.theme.font.content};
    font-weight: ${p => p.theme.weight.bold};
    margin-bottom: 0.5rem;  
    text-align: center;
`;

const Page: React.FC = () => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const { data: session, status } = useSession();
	const [user, setUser] = useState<any>(null);
	const [newName, setNewName] = useState<string>(''); 
  const closeModal = () => setModalType(null);
  const [newProfilePicture, setNewProfilePicture] = useState<string>(''); 
	const [newEmail, setNewEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [newPassword, setnewPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" }); // Redirect to home after logout
    };

    useEffect(() => {
        if (session) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/getstudent?reqId=${session.user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data);  // Assume data contains user info
                    } else {
                        console.error("Failed to fetch user data");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        }
    }, [session]);

	const handleNameChange = async () => {
        try {
            const response = await fetch('/api/changestudentname', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: session?.user.id,
                    newName: newName,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);  // Update the user object with the new name
                setModalType(null);  // Close the modal
            } else {
                console.error("Failed to change name");
            }
        } catch (error) {
            console.error("Error changing name:", error);
        }
    };
	
	const handleEmailChange = async () => {
        try {
            const response = await fetch('/api/changestudentemail', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: session?.user.id,
                    newEmail: newEmail,
					          password
                }),
            });
            setPassword('')

            if (response.ok) {
                const data = await response.json();
                setUser(data);  // Update the user object with the new name
                setModalType(null);  // Close the modal
            } else {
				const errorData = await response.json();
				setError(errorData.error || 'Failed to change email');
                console.error("Failed to change name");
            }
        } catch (error) {
            console.error("Error changing name:", error);
        }
    };

	const handlePasswordChange = async () => {
        try {
            const response = await fetch('/api/changestudentpassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: session?.user.id,
					          password,
                    newPassword,
					          confirmPassword
                }),
            });
            setPassword('')
            setConfirmPassword('')

            if (response.ok) {
                const data = await response.json();
                setUser(data);  // Update the user object with the new name
                setModalType(null);  // Close the modal
            } else {
				const errorData = await response.json();
				setError(errorData.error || 'Failed to change email');
                console.error("Failed to change name");
            }
        } catch (error) {
            console.error("Error changing name:", error);
        }
    };

  const handleProfilePictureChange = async () => {
    try {
        const response = await fetch('/api/changestudentprofilepic', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: session?.user.id,
                newProfilePicture: newProfilePicture,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data);  
            setModalType(null); 
        } else {
            console.error("Failed to change profile picture");
        }
    } catch (error) {
        console.error("Error changing profile picture:", error);
    }
  };

    return (
          <ProtectedRoute requiredRole="student">
            <PageContainer>
                <ContentContainer>
                    <SettingsHeading>settings</SettingsHeading>

                    <InnerContainer>
                        <SettingsContainer>
                            <FieldGroup>
                                <FieldHeading>name</FieldHeading>
                                <FieldText>{user?.display_name || null}</FieldText>
                                <FieldLink onClick={() => setModalType('name')}>change name</FieldLink>
                            </FieldGroup>

                            <FieldGroup>
                                <FieldHeading>email</FieldHeading>
                                <FieldText>{user?.calpoly_email || null}</FieldText>
                                <FieldLink onClick={() => setModalType('email')}>change email</FieldLink>
                            </FieldGroup>

                            <FieldGroup>
                                <FieldHeading>password</FieldHeading>
                                <FieldLink onClick={() => setModalType('password')}>change password</FieldLink>
                            </FieldGroup>

                        </SettingsContainer>

                        <ProfileContainer>
                            <FieldHeading>profile picture</FieldHeading>
                            <ProfileImage src={user?.profile_photo} alt="Profile Picture" />
                            <FieldLink onClick={() => setModalType('picture')}>change picture</FieldLink>
                            <FieldGroup>
                                <LogoutButton onClick={handleLogout}>log out</LogoutButton>
                            </FieldGroup>
                        </ProfileContainer>
                    </InnerContainer>
                </ContentContainer>

                <Modal title="change name" view={modalType === 'name'} onClose={closeModal}>
                    <InputField type="text" 
								placeholder="new name" 
								value={newName} 
								onChange={(e) => setNewName(e.target.value)}  
					/>
                    <SaveButton onClick={handleNameChange}>save</SaveButton>
                </Modal>

				<Modal title="change email" view={modalType === 'email'} onClose={closeModal}>
					<ErrorMessage>{error}</ErrorMessage>
					<InputField
						type="email"
						placeholder="new email"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
					/>
					<InputField
						type="password"
						placeholder="confirm password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<SaveButton onClick={handleEmailChange}>save</SaveButton>
				</Modal>

				<Modal title="change password" view={modalType === 'password'} onClose={closeModal}>
					<ErrorMessage>{error}</ErrorMessage>
					<InputField
						type="password"
						placeholder="old password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputField
						type="password"
						placeholder="new password"
						value={newPassword}
						onChange={(e) => setnewPassword(e.target.value)}
					/>
					<InputField
						type="password"
						placeholder="confirm password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<SaveButton onClick={handlePasswordChange}>save</SaveButton>
				</Modal>
        
        <Modal title="change profile picture" view={modalType === 'picture'} onClose={closeModal}>
                    <InputField 
                        type="url" 
                        placeholder="new profile photo url"
                        value = {newProfilePicture}
                        onChange={(e) => setNewProfilePicture(e.target.value)}
                        />
                    <SaveButton onClick={handleProfilePictureChange}>upload</SaveButton>
        </Modal>
      </PageContainer>
    </ProtectedRoute>
    );
};

export default Page;
