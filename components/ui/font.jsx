import { Roboto, Montserrat, Lexend_Deca } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const fonts = {
  roboto: roboto.className,
  montserrat: montserrat.className,
  lexendDeca: lexendDeca.className, // changed the key to camelCase for consistency
};
