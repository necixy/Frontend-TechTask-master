import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      backgroundAlt: string;
      text: string;
      border: string;
      placeholder: string;
      buttonBg: string;
      buttonBorder: string;
    };
  }
}
