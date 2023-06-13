import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        fontFamily: {
            inter : ['Inter', 'sans-serif'],
            opensans : ['Open Sans', 'sans-serif'],
        },
        extend: {
            colors: {
                primary: defaultTheme.colors.red
            }
        }
    },
    daisyui: {
        themes: [
          {
            mytheme: {
                "primary": "#e11d48",
                "secondary": "#f000b8",
                "accent": "#f3f4f6",
                "neutral": "#c2410c",
                "base-100": "#111827",
                "info": "#3abff8",
                "success": "#36d399",
                "warning": "#fbbd23",
                "error": "#f87272",
            },
          },
        ],
      },
    plugins: [require("daisyui")],

}
