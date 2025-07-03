import { Manrope, Oi, Syne, Chivo } from "next/font/google"
import type { DefaultTheme } from "styled-components"

const foundation = {
    color: {
        primary: "#7D84B2",
        white: "#FFFFFF",
        black: "#5F5F5F",
        grey: {
            default: "#E0E0E0",
            lighter: "#C0C0C0",
            light: "#D0D0D0",
            medium: "#909090",
            dark: "#303030",
            alternate: "#ECECEF"
        }
    }
}

const oi = Oi({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap'
})

const syne = Syne({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap'
})

const manrope = Manrope({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap'
})

const chivo = Chivo({
  subsets: ['latin'],
  weight: ['400', '700'], // Adjust weights as needed
  display: 'swap'
});

declare module "styled-components" {
    export interface DefaultTheme {
        color: {
            'default': string,
            'accent': string,
            'white': string,
            'grey': string
        },
        background: {
            'default': string,
            'white': string,
            'grey': string,
            'hover': {
                'light': string,
                'medium': string,
                'dark': string,
                'alternate': string
            },
            'active': string,
        },
        font: {
            'logo': string,
            'heading': string,
            'content': string
        },
        weight: {
            'light': number,
            'regular': number,
            'medium': number,
            'semibold': number,
            'bold': number
        },
        transition: {
            'default': string,
        }
    }
}

const theme: DefaultTheme = {
    color: {
        'accent': foundation.color.primary,
        'default': foundation.color.black,
        'white': foundation.color.white,
        'grey': foundation.color.grey.default
    },
    background: {
        'default': foundation.color.primary,
        'white': foundation.color.white,
        'grey': foundation.color.grey.default,
        'hover': {
            'light': foundation.color.grey.light,
            'medium': foundation.color.grey.medium + '30',
            'dark': foundation.color.grey.dark + '30',
            'alternate': foundation.color.grey.alternate
        },
        'active': foundation.color.grey.lighter
    },
    font: {
        'logo': `${oi.style.fontFamily}, sans-serif`,
        'heading': `${syne.style.fontFamily}, sans-serif`,
        'content': `${manrope.style.fontFamily}, sans-serif`,
    },

    weight: {
        'light': 300,
        'regular': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700
    },
    transition: {
        'default': '0.25s ease',
    }
}

export default theme