import '@testing-library/jest-dom'

import { jest } from '@jest/globals';

jest.mock("next/font/google", () => ({
    Oi: () => ({
        style: {
            fontFamily: "mocked",
        },
    }),
    Syne: () => ({
        style: {
            fontFamily: "mocked",
        },
    }),
    Manrope: () => ({
        style: {
            fontFamily: "mocked",
        },
    }),
    Chivo: () => ({
        style: {
            fontFamily: "mocked",
        },
    }),
}));