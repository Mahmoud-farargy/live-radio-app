import { createGlobalStyle } from "styled-components";
import fonts from "./fonts/fonts";
import rootStyles from "./root";

const GlobalStyles = createGlobalStyle`
    ${fonts}
    ${rootStyles}
    * {
    padding: 0;
    margin: 0;
  }
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
  }
  body{
    overflow-x: hidden;
  }
  html,
  body {
    height: 100%;
    width: 100%;
  }
  body,
  #app {
    user-select: none;
    min-height: 100vh;
  }

  // themes
  body.darkTheme {
    --gray: #262626;
    --ultra-white: #000000;
    --seconday-clr: #1a1e22;
    --light-gray: #161616;
    --ultra-black: #fff;
    --light-black: #999999;
    --links-clr: #9595f3;
    --bluish-sky: #4e8bc4;
    --shadow-white: #666666;
    --text-black: #d8d7d7;
    --text-dark-black: #dadada;
    --transparent-black: rgba(255, 255, 255, 0.1);
    --more-lighter-gray: #3d3b3b;
    --quaternary-clr: #dadada;
    --homeBoxes-bg-clr: #000000;
    --dark-yellow: rgb(182, 176, 93);
    --lighter-gray: #666666;
  }
  body.darkTheme img {
    filter: brightness(90%);
  }
  body.darkTheme #hotKeys .key__item {
    background-color: var(--more-lighter-gray);
  }
  body.darkTheme .css-b62m3t-container .css-1s2u09g-control {
    background-color: var(--quaternary-clr);
  }
  body.darkTheme {
    #slidableList, ul#stationsList{
      box-shadow: 0px 10px 30px -15px rgba(0, 0, 0, 0.2);
    }
  }
  // Global classes
  img {
    background-color: var(--lighter-gray);
    overflow: hidden;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-style: normal;
    margin-top: 0;
  }
  a, abbr, acronym, button,body, input,address, applet, article, aside, audio, b, big, blockquote, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video{
      font-family: var(--font-fam-main);
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  strong,
  span,
  i {
    color: var(--text-black);
  }
  .modal--backdrop {
    position: fixed;
    inset: 0 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .flex-row {
    display: flex;
    flex-direction: row;
  }
  .logo__text{
      font-weight: var(--font-weight-heavy);
  }
  .flex-column {
    display: flex;
    flex-direction: column;
  }
  .disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .empty--box {
    width: 100%;
    justify-content: center;
    margin-top: 2rem;
    .empty--box--inner {
      align-items: center;
      color: var(--text-black);
      svg {
          font-size: var(--font-size-large);
          margin-right: 0.4rem;
          color: inherit;
      }
    }
  
  }
  .list--name {
    text-transform: capitalize;
    color: var(--text-dark-black);
    letter-spacing: 0.13rem;
    font-size: var(--font-size-medium-x);
  }
  // checkbox
  input#nav-toggler {
    display: none;
    opacity: 0;
  }
  input#nav-toggler:checked + aside#sidebar {
    width: var(--minimized-layout-size);
  }
  .page--container {
    padding: var(--desktop-padding-top) var(--padding-sides)
      var(--desktop-padding-bottom) var(--padding-sides);
    max-width: 1500px;
    min-width: 85%;
    min-height: 100vh;
    height: 100%;
    width: 100%;
    margin: 0 auto;
  }
  .active--effect:active {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
  }
  
  // player
  .player--container.react-jinke-music-player-main .music-player-panel {
    z-index: var(--z-player);
  }
  .player--container.react-jinke-music-player-main .music-player-panel {
    border-top: 1px transparent solid;
  }
  .react-jinke-music-player-main
    .react-jinke-music-player-mobile-header-right
    svg {
    font-size: var(--font-size-x-large);
  }
  .player--container.react-jinke-music-player-main.light-theme
    .music-player-panel {
    border-top-color: var(--lighter-gray);
  }
  a.active--nav--link.active--nav--link {
    background-color: var(--primary-clr) !important;
    color: #fff !important;
    .nav-item-icon,
    .nav-item-name {
      color: inherit;
    }
  }
  
  .station--name,
  .station--location {
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .station--name {
    font-weight: var(--font-weight);
    font-size: var(--font-size-small);
    color: var(--text-black);
  }
  .station--location {
    font-weight: var(--font-weight);
    font-size: 0.78em;
    color: var(--text-gray);
  }
  .see--all--btn {
    font-weight: var(--font-weight);
    color: var(--primary-clr);
    text-transform: capitalize;
    cursor: pointer;
    padding: 0 2px;
    transition: color 0.3s linear;
    &:hover {
      color: rgb(76, 121, 76);
    }
  }
  // slidable lists
  #slidableList, #slidableListLoading {
    width: 100%;
    background-color: var(--homeBoxes-bg-clr);
    padding: 1.3rem 1.5rem;
    margin-top: 1.3rem;
    border-radius: var(--radius-curved);
    min-height: 240px;
    overflow: hidden;
    min-width: 100px;
  }
  #slidableList{
    .slidableList--header {
      width: 100%;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    ul.slidableList--ul {
      padding: 0;
      list-style: none;
      width:100%;
      position: relative;
      overflow-x:auto;
      overflow-y: hidden;
      max-width: 100vw;
      align-items:center;
      margin-bottom:0;
      min-height: 50px;
      align-content: flex-start;
      transition: all 0.5 ease-in;
      &::-webkit-scrollbar{
          width:0;
          display: none;
      };
      white-space: nowrap;
      .react-multi-carousel-list{
          align-items: flex-start;
      }
      .slidablelist--right--arrow,
      .slidablelist--left--arrow {
        top: 50%;
        transform: translate(0, -50%);
        position: absolute;
        background: 0 0;
        border: none;
        border-color: transparent;
        width: 35px;
        height: 100%;
        cursor: auto;
        &:focus {
          outline: none;
        }
        &:active svg {
          border-color: #096dd9;
        }
        svg {
          filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.4));
          width: 30px;
          height: 30px;
          color: var(--primary-clr);
          border-radius: 50%;
          border: 1px solid;
          border-color: transparent;
          font-size: 50px;
        }
      }
    }
    @media only screen and (min-width: 780px) {
      ul.slidableList--ul {
        .slidablelist--right--arrow,
        .slidablelist--left--arrow {
          display: none;
        }
        &:hover {
          .slidablelist--right--arrow,
          .slidablelist--left--arrow {
            display: inline;
          }
        }
      }
    }
    @media only screen and (max-width: 670px) {
      padding: 1rem 0.4rem;
      ul.slidableList--ul {
        .slidablelist--right--arrow,
        .slidablelist--left--arrow {
          display: none;
        }
      }
    }
  }
  #slidableListLoading{
    display: grid;
    place-content: center;
  }
  .primary__input {
    border: 2px solid var(--lighter-gray);
    border-radius: 0.4rem;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    padding: 0.6rem 3.3rem 0.6rem 0.7rem;
    background-color: var(--quaternary-clr);
    transition: 0.4s ease;
    transition-property: border-color, background-color;
    &::placeholder {
      color: var(--dark-gray);
    }
    &:hover {
      border-color: var(--light-gray);
    }
    &:focus {
      outline: none;
      border-color: var(--primary-clr);
      background-color: #fff;
    }
  }

  .items--wrapper, .wrapper{
   overflow-x: hidden;
  }
  .wrapper, .items--wrapper, .wrapper{
    overflow-y: hidden;
  }
  .primary__btn {
    padding: 0.5rem 0.9rem;
    background-color: var(--primary-clr);
    color: #fff;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: filter 0.3s linear;
    text-align: center;
    text-transform: uppercase;
    font-size: var(--font-size-medium);
    &:hover {
      filter: brightness(1.1);
    }
  }
  #settings {
    padding-right: 1rem;
    .settings--input--group {
      border-bottom: 1px solid var(--gray);
      &:last-of-type {
        border-bottom: 0;
      }
    }     
    .vertical--group{
          justify-content: center;
          margin-bottom: 1rem;
          label{
              margin-bottom: 0.6rem;
          }
      }
    .primary__btn{
        margin-top: 1.2rem;
    }
    label{
          color: var(--text-black);
    }
    .settings--select--group{
        margin: 1rem 0;
        align-items: center;
        justify-content: space-between;
  
        select{
            border: 2px solid var(--lighter-gray);
            background-color: var(--quaternary-clr);
            border-radius: 0.4rem;
            transition: 0.3s linear;
            padding:0.5rem 3.3rem 0.5rem 0.7rem;
            transition-property: border-color, background-color;
            &:focus{
                border-color: var(--primary-clr);
                background-color: #fff;
                outline: none;
            }
        }
    }
    
  }
  
  .ReactModalPortal{
      .ReactModal__Overlay{
          z-index: var(--z-modal-backdrop);
          .modal__header{
              position: relative;
              width: 100%;
              max-height: 80px;
              
              strong{
                  text-transform: capitalize;
              }
              span.close__modal__btn{
                  position: fixed;
                  top: 10px;
                  right: 0;
                  font-weight: var(--font-weight-medium);
                  font-size: var(--font-size-x-large);
                  padding: 0.3rem 0.7rem;
                  cursor: pointer;
                  transition: 0.3s linear;
                  transition-property: background-color, color;
                  border-radius: 0.1rem;
                  &:active{
                      background-color: var(--primary-clr);
                      color: #fff;
                  }
              }
          }
          .ReactModal__Content{
              max-height: 90vh;
              overflow-y: auto !important;
              background-color: var(--ultra-white) !important;
              width: 600px;
          }
      }  
  }
  .stationsList--item--select{
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    vertical-align: text-top;
    width: 30px;
    height: 30px;
    max-width: 200px;
    color: inherit;
    select{
        background-color: var(--homeBoxes-bg-clr);
        color: var(--text-dark-black);
        cursor: pointer;
        position: absolute;
        width: 100%;
        height: 100%;
        appearance: none;
        border:none;
        opacity: 0;
        &:focus{
            outline: none;
        }
    }
  }
  
  // --xx-- Global classes --xx--
  div#routesContainer {
    width: 100%;
    padding: 20px 1.2rem 10px;
  }
  
  // responsive
  // 780px and above
  @media only screen and (min-width: 780px) {
    input#nav-toggler:checked ~ main#screens {
        margin-left: var(--minimized-layout-size) !important;
      }
    #suggestions #recommended .remomended--list {
      grid-template-columns: repeat(4, 1fr);
    }
    input#nav-toggler:checked + aside#sidebar .sidebar--inner .search,
    input#nav-toggler:checked + aside#sidebar ul li .nav-item-name,
    input#nav-toggler:checked + aside#sidebar .copyright__sidebar {
      display: none;
    }
    #sidebar
      .sidebar-container
      .sidebar--inner
      #menuSection
      ul.menu--section--inner
      li.menu__section__item {
      &:hover {
        &::before {
          position: absolute;
          bottom: -27px;
          z-index: 30;
          color: var(--ultra-white);
          padding: 0.2rem 0.4rem;
          border-radius: 0.3rem;
          max-width: 150px;
          white-space: nowrap;
          text-transform: capitalize;
          overflow: hidden;
          text-overflow: ellipsis;
          content: attr(data-title);
          background-color: var(--ultra-black);
          font-size: var(--font-size-x-small);
        }
      }
    }
  }
  // 980px and less
  @media only screen and (max-width: 980px) {
    section#suggestions {
      grid-template-columns: 100%;
    }
  }
  // 700px and less
  @media only screen and (max-width: 700px) {
    :root {
      --minimized-layout-size: 84%;
    }
    aside#sidebar#sidebar {
      width: 0;
    }
    main#screens#screens {
      margin-left: 0;
    }
    div#routesContainer {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    input#nav-toggler:checked ~ main#screens .modal--backdrop {
      display: block;
    }
  }
  // 670px and less
  @media only screen and (max-width: 670px) {
    ul#stationsList {
      padding: 1.3rem 0.4rem;
    }
    #recommended,
    #featured {
      padding: 1.3rem 0rem;
    }
    #suggestions #recommended .remomended--list {
      grid-template-columns: repeat(2, 1fr);
    }
    .sidebar--inner .search {
      margin-top: 0.8rem;
    }
    #slidableListItem {
      width: 140px;
    }
    .ReactModalPortal{
          .ReactModal__Overlay{
              .ReactModal__Content{
                  width: 95%;
              }
          }  
    }
  }
  
  // 300px and less
  @media only screen and (max-width: 300px) {
    section#suggestions #recommended .remomended--list {
      grid-template-columns: 100%;
    }
  }
  
  
  // animations
  
  .global--loading{
    position: fixed;
    top:0;
    left:0;
    @keyframes spin {
        to {
            transform: rotateZ(360deg);
        }
    }
    height: 100vh;
    width: 100%;
    display: flex;
    z-index: var(--z-global-loading);
    justify-content: center;
    align-items:center;
    background: var(--ultra-white);
    span {
    display: block;
    margin: 0 auto;
    width:60px;
    height: 60px;
    border: 4px solid transparent;
    border-top-color: var(--primary-clr);
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
    -webkit-animation: spin ease 1000ms infinite;
    }
  }
`;

export default GlobalStyles;