import { css } from "styled-components";

const root = css`
// Root
:root {
  /* Paddings */
  --desktop-padding-top: 80px;
  --desktop-padding-bottom: 30px;
  --padding-sides: 9vw;
  // margins
  --default-layout-size: 340px;
  --minimized-layout-size: 70px;
  --player-height-size: 80px;
  // heights
  --height-header: 50px;
  /* colors */
  --primary-clr: #31c27c; //10%
  --seconday-clr: #f5f5f5; //60%
  --tertiary-clr: #2f2a34; //20%
  --quaternary-clr: #ffffff; //10%
  --dark-gray: #545057;
  --ultra-white: #fff;
  --ultra-black: #171717;
  --gray: #dbdbdb;
  --light-gray: #bababa;
  --homeBoxes-bg-clr: #fbfcff;
  --lighter-gray: #e4e4e4;
  --more-lighter-gray: #efefef;
  --text-gray: #74706b;
  --text-black: #171717;
  --text-dark-black: #363636;
  --dark-green: rgb(64, 150, 100);
  --light-red: #ed4956;
  --light-primary-clr: rgba(49, 194, 124, 0.12);
  --transparent-black: rgba(0, 0, 0, 0.1);
  --dark-yellow: rgb(66, 62, 3);
  --pill-bg-color: #fff;
  --pill-text-color: "#333333";
  --borders-clr: #eaeaea;
  // letter spacing
  --spacing: 0.25rem;
  // border radius
  --radius: 0.5rem;
  --radius-curved: 1.5rem;
  /* font-sizes */
  //-- static
  --font-size-sm: 14px;
  //-- responsize
  --font-size-x-small: 0.75em;
  --font-size-small: 0.875em;
  --font-size-medium: 0.95em;
  --font-size-medium-x: 1.2em;
  --font-size-large: 1.25em;
  --font-size-x-large: 1.5em;
  --font-size-xx-large: 1.8em;
  /* font weights */
  --font-weight: 400;
  --font-weight-medium: 500;
  --font-weight-heavy: 700;
  --font-weight-x-heavy: 900;
  /* font families */
  --font-fam-main: Raleway,"Segoe UI",Arial, sans-serif;
  /* transitions */
  --transition-mild: 500ms ease all;
  --transition-medium: all 1s ease;
  --transition-normal: all 0.3s linear;
  /* shadows */
  --slight-shadow: 0 1px 15px rgba(0, 0, 0, 0.08);
  --light-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  --dark-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  // z-index's
  --z-header: 150;
  --z-sidebar: 100;
  --z-backdrop: 80;
  --z-player: 250;
  --z-global-loading: 90;
  --z-modal-backdrop: 300;
  --z-modal-inner: 350;
  /* paddings */
  --page-desktop-paddings: 1.25rem 1.2rem 0.625rem;
  --page-mobile-paddings: 1.25rem 1.2rem 0.625rem;
}
`;

export default root;