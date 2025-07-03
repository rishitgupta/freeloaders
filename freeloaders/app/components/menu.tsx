import Link from "next/link";
import { useState } from "react";
import styled from "styled-components"
import { signOut } from "next-auth/react";

const MenuStyled = styled.div`
    width: max-content;
    height: auto;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 10vh;
    right: 2.5vh;
    padding: 1vh 0;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: ${p => p.theme.background.white};
    box-shadow: 0px 5px 10px #30303030;
    z-index: 998;
`

const MenuItem = styled(Link)`
    padding: 1vh 2.5vw;
    box-sizing: border-box;
    font-size: 1.125em;
    font-family: ${p => p.theme.font.content};
    transition: background-color ${p => p.theme.transition.default};
    &:hover { background-color: ${p => p.theme.background.hover.dark}; }
`

interface MenuProps {
    items: [string, string][];
    view: boolean;
}

const Menu = (props: MenuProps) => {
    const { items, view, ...rest } = props

    const [hover, setHover] = useState(false)
    const whenHovering = () => setHover(true)
    const whenNotHovering = () => setHover(false)
    const onClickFunction = async () => {
        whenNotHovering()
        await signOut({ callbackUrl: "/" })
    }
    

    return (view || hover) ? (
        <MenuStyled
            onMouseEnter={whenHovering}
            onMouseLeave={whenNotHovering}
            {...rest}
        >
            {items.map((item, index) => (
                <MenuItem
                    key={index}
                    href={item[1]}
                    onClick={(item[0] == 'log out') ? onClickFunction : whenNotHovering}
                >
                    {item[0]}
                </MenuItem>
                ))}
        </MenuStyled>
    ) : <></>
}

export default Menu