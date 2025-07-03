'use client'

import styled from "styled-components";
import { useState } from "react";
import Modal from "./modal";
import Link from "next/link";
import Menu from "./menu";
import { signIn, useSession } from "next-auth/react";
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"


const NavbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height:10vh;
    background-color: ${p => p.theme.background.default};
`

const LogoTextWrapper = styled.div`
    // background-color: ${p => p.theme.background.white};
    padding: 1.2vh 2vw;
`

const LogoText = styled(Link)`
    user-select: none;
    font-size: 5.27vh;
    font-family: ${p => p.theme.font.logo};
    color: ${p => p.theme.color.white};
`
const UserButtonWrapper = styled.div`
    padding: 1vh 2vw;
    display: flex;
    align-items: center;
`;

const LoginButton = styled.button`
    font-size: 1.5em;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.white};
    padding: 5px 10px;
    border-radius: 7.5px;
    transition: background-color ${p => p.theme.transition.default};
    &:hover { background-color: ${p => p.theme.background.hover.dark}; }
`

// Specifically for the Log-In Modal
const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    margin-bottom: 1vh;
`

const InputStyled = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    font-family: ${p => p.theme.font.content};
    color: ${p => p.theme.color.default};
`

const ForgotPassword = styled(Link)`
    width: fit-content;
    border-bottom: 1px solid ${p => p.theme.color.white};
    margin-left: 5px;
    color: ${p => p.theme.color.accent};
    transition: border-color ${p => p.theme.transition.default};
    &:hover { border-color: ${p => p.theme.color.accent}; }
`

const LogInButton = styled.button`
    align-self: center;
    width: 35%;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    border: 4px solid #8A8A8A; 
    border-radius: 8px;
    margin: 2vh 0;
    user-select: none;
    font-size: 1.25rem;
    font-weight: ${p => p.theme.weight.bold};
    font-family: ${p => p.theme.font.content};
    color: ${p => p.theme.color.default};
    background-color: ${p => p.theme.background.grey};
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25);
    transition: background-color ${p => p.theme.transition.default};
    &:hover { background-color: ${p => p.theme.background.hover.light}; }
    &:active { background-color: ${p => p.theme.background.active}; }
`;

const CreateAnAccount = styled(Link)`
    margin: 2vh 0;
    font-size: 1.25em;
    font-weight: ${p => p.theme.weight.bold};
    color: ${p => p.theme.color.accent};
`
const ErrorMessage = styled.div`
    color: red;
    font-size: 0.9rem;
    margin-top: -0.5rem;
    margin-bottom: 0.5rem;
`;

const UserIcon = styled(UserCircle)`
    font-size: 3rem;
    color: ${p => p.theme.color.white};
    cursor: pointer;
    weight: bold;
    &:hover { color: ${p => p.theme.color.default}; }
`;

const UserIconWrapper = styled(Link)`
    display: inline-block;
    padding: 5px;
`;

const handleLogin = async (email: string, password: string) => {
  try {
      const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
      });
      if (result?.error) {
          return null // failure case
      } else {
          return result //success case
      }
  } catch (error) {
      console.error("Login error:", error);
  }
};

const ProfilePhoto = styled.img`
    height: 100%;
    border-radius: 50%;
    padding: 1vh 0;
    margin-right: 2.5vw;
    box-sizing: border-box;
`

const CreateEventButtonStyled = styled(Link)`
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  column-gap: 5px;
  box-sizing: border-box;
  padding: 0.5vh 1vw;
  border-radius: 8px;
  user-select: none;
  color: ${p => p.theme.color.white};
  background-color: ${p => p.theme.background.default};
  transition: background-color ${p => p.theme.transition.default};
  &:hover {background-color: ${p => p.theme.background.hover.dark};}
  font-family: ${p => p.theme.font.content};
  font-weight: ${p => p.theme.weight.medium};
`

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
`

const Navbar = (props: object) => {
    const { ...rest } = props
    const { data: session, status } = useSession();
    const [viewLogInModal, setViewLogInModal] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    const openLogInModal = () => setViewLogInModal(true);
    const closeLogInModal = () => {
        setViewLogInModal(false);
        setLoginError(null);
    };
    
    const submitHandler = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const result = await handleLogin(email, password);
          console.log(result)
          if (result != null) {
              setViewLogInModal(false)
              setLoginError(null); 
          } else {
              setLoginError("Invalid email or password. Please try again.");
          }
          setEmail("");
          setPassword("");
      } catch (error) {
          setLoginError("An unexpected error occurred. Please try again.");
          console.error("Error in submitHandler:", error);
      }
  };

    const LogInSection = () => {
        let loggedIn = true // temp variable

        const [viewProfileMenu, setViewProfileMenu] = useState(false)
        const openProfileMenu = () => setViewProfileMenu(true)
        // 'setTimeout' because it might take time to reach the menu and the hover might end
        const closeProfileMenu = () => setTimeout(() => setViewProfileMenu(false), 250)

        return (
            <UserButtonWrapper>
                {status === "loading" ? null : session ? (
                        <>
                            {session.user.role == "student" ? (
                              <UserIconWrapper
                                  href="/user-settings"
                                  onMouseEnter={openProfileMenu}
                                  onMouseLeave={closeProfileMenu}
                              >
                                  <UserIcon />
                              </UserIconWrapper>
                            ) : (
                              <RightWrapper>
                                <CreateEventButtonStyled
                                href="/create-event">Create Event</CreateEventButtonStyled>
                                <UserIconWrapper
                                  href="/profile"
                                  onMouseEnter={openProfileMenu}
                                  onMouseLeave={closeProfileMenu}
                                >
                                  <UserIcon />
                                </UserIconWrapper>
                              </RightWrapper>
                            )}  

                            {session.user.role == "student" ? (
                            <Menu view={viewProfileMenu} items={[["settings", "/user-settings"], ["log out", "/"]]} />
                            ): (<Menu view={viewProfileMenu} items={[["profile", "/profile"], ["settings", "/org-settings"], ["log out", "/"]]} />
                            )}
                        </>
                    ) : (
                        <LoginButton onClick={openLogInModal}>log in / sign up</LoginButton>
                    )}
            </UserButtonWrapper>
        )
    }

    return (
        <>
            <NavbarContainer {...rest}>
                <LogoTextWrapper>
                    <LogoText href="/">freeloaders</LogoText>
                </LogoTextWrapper>
                <LogInSection />
            </NavbarContainer>

            <Modal title="log in" view={viewLogInModal} onClose={closeLogInModal}>
                <FormStyled onSubmit={submitHandler}>
                    {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
                    <InputStyled type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <InputStyled type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {/*<ForgotPassword href="#">forgot password?</ForgotPassword>*/}
                    <LogInButton type="submit">log in</LogInButton>
                </FormStyled>
                <CreateAnAccount href="/create-account" onClick={closeLogInModal}>create an account!</CreateAnAccount>
            </Modal>
        </>
    )
}

export default Navbar