import Menu from "../menu"
import { screen, fireEvent } from '@testing-library/react'
import renderWithTheme from '../../lib/jestImport'

describe('Menu', () => {
    const basicMenu = (view: boolean) => (
        <Menu
            view={view}
            items={[["item 1", "#"], ["item 2", "#"]]}
            data-testid="menu"
        />
    )

    it('renders the menu when view is true', () => {
        renderWithTheme(basicMenu(true))

        expect(screen.queryByTestId("menu")).toBeInTheDocument()
        expect(screen.queryByText("item 1")).toBeInTheDocument()
    })
})
