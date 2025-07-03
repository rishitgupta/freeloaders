"use client"

import { Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { Check } from "@phosphor-icons/react/dist/ssr/Check"

// '!==' acts like a boolean XOR
const TabStyled = styled.button.attrs<{
    $selected: boolean,
    $accent: boolean,
    $color?: string,
    $background?: string,
    $hover?: string,
}>(p => ({
    $color: p.$selected !== p.$accent ? p.theme.color.white : p.theme.color.accent,
    $background: p.$selected !== p.$accent ? p.theme.background.default : p.theme.background.white,
    $hover: !p.$selected ? (p.$accent ? p.theme.background.hover.dark : p.theme.background.hover.medium) : p.$background,
}))`
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    column-gap: 5px;
    box-sizing: border-box;
    padding: 0.5vh 1vw;
    border-radius: 8px;
    user-select: none;
    color: ${p => p.$color};
    background-color: ${p => p.$background};
    transition: background-color ${p => p.theme.transition.default};
    &:hover {background-color: ${p => p.$hover};}
`

const Icon = styled(Check)<{ $view: boolean }>`
    display: ${p => p.$view ? 'block' : 'none'};
`;

const TabsContainer = styled.div`
    width: fit-content;
    display: flex;
    justify-content: space-evenly;
    column-gap: 10px;
    font-family: ${p => p.theme.font.content};
    font-weight: ${p => p.theme.weight.medium};
`

const Tab = ({ name, selected, accented, onClick }: { name: string, selected: boolean, accented: boolean, onClick: () => void }) => (
    <TabStyled $selected={selected} $accent={accented} onClick={onClick}>
        <Icon $view={selected} />
        {name}
    </TabStyled>
)

const Tabs = ({ items, selected, setSelected, accented }: {
    items: [string, string],
    selected: number,
    setSelected: Dispatch<SetStateAction<number>>,
    accented?: boolean
}) => (
    <TabsContainer>
        {items.map((name, index) => {
            return (
                <Tab
                    name={name}
                    key={`tab-${index}`}
                    selected={selected == index}
                    accented={accented || false}
                    onClick={() => {setSelected(index)}}
                />
            )
        })}
    </TabsContainer>
)

export default Tabs