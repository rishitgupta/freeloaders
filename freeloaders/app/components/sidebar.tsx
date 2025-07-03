'use client';

import styled from "styled-components";
import Link from "next/link";
import { useState } from 'react';

const SidebarContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    z-index: 100;
`

const SidebarNav = styled.nav`
    width: 35vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-content: space-evenly;
    padding-left: 3vw;
    background-color: ${p => p.theme.background.default};
`

const SidebarButtonStyled = styled.button`
    width: 4vw;
    height: 4vw;
    border-radius: 100%;
    margin-left: 1vw;
    font-size: 2.5rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.white};
    background-color: ${p => p.theme.background.default};
`

const Logo = styled.h2`
    padding-top: 10vh;
    padding-bottom: 5vh;
    font-size: 2.5rem;
    font-family: ${p => p.theme.font.logo};
    color: ${p => p.theme.color.white};
`

const SidebarLink = styled.li`
    padding-top: 1vh;
    font-size: 2.5rem;
    font-weight: ${p => p.theme.weight.bold};
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.white};
`

const SidebarLoveNote = styled.h4`
    padding-top: 8vh;
    font-size: 1rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.white};
`

const SidebarButton = ({ sidebarOpen, toggleSidebar }: { sidebarOpen: boolean; toggleSidebar: () => void }) => {
    let arrow;
    if (sidebarOpen) {
        arrow = "<";
    } else {
        arrow = ">";
    }
    return <SidebarButtonStyled onClick={toggleSidebar}>{arrow}</SidebarButtonStyled>
}

const Sidebar = () => {
    const [open, setOpen] = useState(false)
    const toggleSidebar = () => setOpen(!open)

    return (
        <SidebarContainer>
            {open ?
                <SidebarNav>
                    <Logo>freeloaders</Logo>
                    <ul>
                        <SidebarLink><a href="#">Home</a></SidebarLink>
                        <SidebarLink><a href="#">My Profile</a></SidebarLink>
                        <SidebarLink><a href="#">Settings</a></SidebarLink>
                    </ul>
                    <SidebarLoveNote>made with {"<"}3 by reenu, wingsum, suhanth, dennis, and rish</SidebarLoveNote>
                </SidebarNav>
            : <></>}
            <SidebarButton sidebarOpen={open} toggleSidebar={toggleSidebar} />
        </SidebarContainer>
    )
}

export default Sidebar