import Modal from "../modal"
import { screen, fireEvent } from '@testing-library/react'
import renderWithTheme from '../../lib/jestImport'

describe('Modal', () => {
    const basicModal = (view: boolean, onClose: () => void) => (
        <Modal
            view={view}
            onClose={onClose}
            title="Modal Title"
            data-testid="modal"
        >
            Modal Description
        </Modal>
    )

    it('renders the modal when view is true', () => {
        renderWithTheme(basicModal(true, () => {}))

        expect(screen.queryByTestId("modal")).toBeInTheDocument()
        expect(screen.queryByText("Modal Title")).toBeInTheDocument()
    });

    it('does not render the modal when view is false', () => {
        renderWithTheme(basicModal(false, () => {}))

        expect(screen.queryByTestId("modal")).not.toBeInTheDocument()
        expect(screen.queryByText("Modal Title")).not.toBeInTheDocument()
    })

    it('calls the onClose function when the close button is clicked', () => {
        const handleClose = jest.fn();
        renderWithTheme(basicModal(true, handleClose))

        // Simulate clicking the close button
        fireEvent.click(screen.getByRole('button'))

        // Check that the onClose function was called
        expect(handleClose).toHaveBeenCalledTimes(1)
    })
})
