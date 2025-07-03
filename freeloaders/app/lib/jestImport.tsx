import { render } from "@testing-library/react"
import { ThemeProvider } from "styled-components"
import theme from './tokens'
import { ReactNode } from "react"

const renderWithTheme = (children: ReactNode) => {
    return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>)
}

export default renderWithTheme