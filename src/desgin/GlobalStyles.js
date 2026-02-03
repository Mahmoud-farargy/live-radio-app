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
    --ultra-white: #121212;
    --seconday-clr: #1e1e1e;
    --light-gray: #161616;
    --ultra-black: #EDEDED;
    --light-black: #999999;
    --links-clr: #9595f3;
    --bluish-sky: #4e8bc4;
    --shadow-white: #666666;
    --text-black: #d8d7d7;
    --text-dark-black: #e0e0e0;
    --transparent-black: rgba(255, 255, 255, 0.1);
    --more-lighter-gray: #1c1c1c;
    --quaternary-clr: #1e1e1e;
    --dark-gray: #e5e5e5;
    --homeBoxes-bg-clr: #121212;
    --dark-yellow: rgb(182, 176, 93);
    --lighter-gray: #666666;
    --pill-bg-color: #2a6045;
    --pill-text-color: #e5e5e5;
    --player-bg: rgb(18, 18, 18, 0.75);
    --borders-clr: #333;
    --text-gray: #92908e;

    /* inputs */
    --select-bg: #1e1e1e;
    --select-bg-menu: #1a1a1a;
    --select-border: #2a2a2a;
    --select-border-focus: #3ea6ff;
    --select-option-hover: #242424;
    --select-option-selected: #2d2d2d;
    --select-text: #e5e5e5;
    --select-text-muted: #9ca3af;
  }
  body.darkTheme {
    background-color: var(--ultra-white);
    .react-jinke-music-player-main .music-player-panel {
      background-color: var(--player-bg);
    }
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
    .slidableList, #stationsList{
      box-shadow: 0px 10px 30px -15px rgba(0, 0, 0, 0.2);
    }
    .app-select__control{
      background-color: var(--select-bg);
      border: 1px solid var(--select-border);
      min-height: 42px;
      box-shadow: none;
      &:hover{
        border-color: var(--select-border-focus);
      }
    }
    .app-select__control--is-focused {
      border-color: var(--select-border-focus);
      box-shadow: none;
    }
    .app-select__single-value {
      color: var(--select-text);
    }

    .app-select__input-container {
      color: var(--select-text);
    }

    .app-select__input {
      color: var(--select-text);
    }
    .app-select__placeholder {
      color: var(--select-text-muted);
    }
    .app-select__menu {
      background-color: var(--select-bg-menu);
      border-radius: 6px;
      overflow: hidden;
    }
    .app-select__option {
      color: var(--select-text);
      cursor: pointer;
    }

    .app-select__option--is-focused {
      background-color: var(--select-option-hover);
    }

    .app-select__option--is-selected {
      background-color: var(--select-option-selected);
    }
    .app-select__dropdown-indicator {
      color: var(--select-text-muted);
    }

    .app-select__dropdown-indicator:hover {
      color: var(--select-border-focus);
    }

    .app-select__indicator-separator {
      display: none;
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
  small,
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
  .ellipsis-x1{
    -webkit-line-clamp:1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal;
  }
  .player_title-lg{
    display: flex;
    align-items:center;
    flex-wrap: nowrap;
    gap:0.4rem;
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
    pointer-events: none;
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
  .react-jinke-music-player-main .music-player-panel .panel-content .img-rotate{
    animation: none;
  }
  .react-jinke-music-player-main
    .react-jinke-music-player-mobile-header-right
    svg {
    font-size: var(--font-size-x-large);
  }
  .player--container.react-jinke-music-player-main.light-theme
    .music-player-panel {
    border-top-color: var(--borders-clr);
  }
  a.active--nav--link.active--nav--link {
    background-color: var(--primary-clr) !important;
    color: #fff !important;
    .nav-item-icon,
    .nav-item-name {
      color: inherit;
    }
    .nav-item-name{
      white-space: nowrap;
    }
  }
  
  .station--name {
    font-weight: var(--font-weight);
    font-size: var(--font-size-small);
    color: var(--text-black);
    margin-bottom: 0.2rem;
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
  .player--container.live__mode{
    .progress-bar-content .audio-main, .react-jinke-music-player-mobile .react-jinke-music-player-mobile-progress.group{
      display: none !important;
    }
  }
  // slidable lists
  .slidableList, #slidableListLoading {
    width: 100%;
    background-color: var(--homeBoxes-bg-clr);
    padding: 1.3rem 1.5rem;
    margin-top: 1.3rem;
    border-radius: var(--radius);
    min-height: 240px;
    overflow: hidden;
    min-width: 100px;
  }
  .slidableList {
    .slidableList--header {
      width: 100%;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    ul.slidableList--ul {
      list-style: none;
      &::-webkit-scrollbar{
          width:0;
          display: none;
      };
    }
    .slidablelist--right--arrow{
      right: -1.6rem;
    }
    .slidablelist--left--arrow{
      left: -1.6rem;
    }
    .slidablelist--right--arrow,
    .slidablelist--left--arrow {
        top: 50%;
        z-index: 1;
        transform: translate(0, -50%);
        position: absolute;
        background: 0 0;
        border: none;
        border-color: transparent;
        width: 2.188rem;
        height: 100%;
        cursor: auto;
        &:focus {
          outline: none;
        }
        &:active svg {
          border-color: var(--primary-clr);
        }
        svg {
          filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.4));
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid;
          border-color: transparent;
          font-size: 50px;
        }
        &:not([disabled]){
          svg {
            color: var(--primary-clr);
          }
        }
    }
    @media only screen and (min-width: 780px) {
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
    @media only screen and (max-width: 670px) {
      padding: 1rem 0;
      border-radius: 0;
       .slidableList--header {
        padding: 0 0.8rem;
       }
      .slidablelist--right--arrow,
      .slidablelist--left--arrow {
        display: none;
      }
    }
  }
  #slidableListLoading{
    display: grid;
    place-content: center;
  }
  #shareList{
    margin: 1.5rem 0 1rem 0;
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    padding-inline: 1rem;
    button {
      &:hover{
        transform: scale(1.08);
        transition: transform 200ms ease-in-out;
      }
    }
  }
  button.react-share__ShareButton {
    display: block !important;
    &.__web-inspector-hide-shortcut__, .__web-inspector-hide-shortcut__ *{
      visibility: visible !important;
    }
    align-items: center;
    justify-content: center;
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
      &::placeholder {
        color: var(--light-gray);
      }
    }
  }
  .embla__viewport {
    cursor: grab;
  }

  .embla__viewport:active {
    cursor: grabbing;
  }
  .items--wrapper, .wrapper{
   overflow-x: hidden;
  }
  .wrapper, .items--wrapper, .wrapper{
    overflow-y: hidden;
  }
  .react-jinke-music-player-main svg:active, .react-jinke-music-player-main svg.favIcon {
      color: var(--primary-clr);
  }
  .fav__btn--player {
    padding: 0 0.2rem;
  }
  .transparent_btn {
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .primary__btn {
    padding: 0.5rem 0.9rem;
    background-color: var(--primary-clr);
    color: #fff;
    border: none;
    border-radius: 0.4rem;
    gap:0.2rem;
    cursor: pointer;
    transition: filter 0.3s linear;
    text-align: center;
    text-transform: uppercase;
    font-size: var(--font-size-medium);
    span{
      color: #fff;
    }
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
  #modal {
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal-backdrop);
    }

    .modal-container {
      background: var(--ultra-white);
      border-radius: 12px;
      width: min(92vw, 520px);
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      animation: modalFadeIn 0.15s ease-out;
    }

    .modal-header {
      padding: 0.9rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--borders-clr);
    }

    .modal-title {
      font-size: 1rem;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      line-height: 1;
      color: var(--dark-gray);
    }

    .modal-body {
      padding: 1rem 1.25rem;
      overflow-y: auto;
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
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
  .ring-container {
      position: relative;
      display: flex;
      width: 15px;
      height: 15px;
  }
  .load--more__button__container {
    margin-top: 1rem;
    padding: 0 1rem;
    button {
      padding: 1rem;
      border: none;
      outline: none;
      background: transparent;
      cursor: pointer;
      color: var(--primary-clr);
    }
  }
  .ring-container .circle {
      width: 8px;
      height: 8px;
      background-color: #f98585;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }

  .ring-container .ringring {
      border: 3px solid #f98585;
      -webkit-border-radius: 30px;
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0.0;
  }
  /* embla */
  .embla {
    position: relative;
  }

  .embla__viewport {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
    gap: 12px;
  }

  .embla__slide {
    flex: 0 0 auto;
    width: 200px;
  }

  /* responsive */
  @media (max-width: 540px) {
    .embla__slide {
      width: 8.75rem;
    }
  }
  /* end embla */
  
  @-webkit-keyframes pulsate {
      0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
      50% {opacity: 1.0;}
      100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;}
  }
  // --xx-- Global classes --xx--
  .page-container {
    padding: var(--page-paddings);
  }
  .fluid-container {
    padding: var(--fluid-container-paddings);
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
    input#nav-toggler:checked + aside#sidebar .copyright__sidebar,
    input#nav-toggler:not(:checked) + aside#sidebar .current--active--menu--inner ul li.tooltip:hover::before {
      display: none;
    }
    .tooltip {
      position: relative;
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
          font-size: var(--font-size-sm);
          padding: 0.3rem 0.6rem;
        }
      }
    }
    input#nav-toggler:checked + aside#sidebar ul .current--active--menu--inner li.tooltip:hover::before {
      display: flex;
    }
  }
  // 980px and less
  @media only screen and (max-width: 980px) {
    :root{
       --page-paddings: 1.25rem 1.2rem 0.625rem;
    }
    section#suggestions {
      grid-template-columns: 100%;
    }
  }
  // 700px and less
  @media only screen and (max-width: 700px) {
    :root {
      --minimized-layout-size: 84%;
      --fluid-container-paddings: 0.2rem 0;
      --page-paddings: 1.25rem 0.8rem 0.625rem;
    }
    aside#sidebar#sidebar {
      width: 0;
    }
    main#screens#screens {
      margin-left: 0;
    }
    input#nav-toggler:checked ~ main#screens .modal--backdrop {
      display: block;
    }
  }
  // 670px and less
  @media only screen and (max-width: 670px) {
    .stationsList--outer--container ul#stationsList {
      padding: 1.3rem 0.3rem;
      li#stationsListItem {
        padding: 0.4rem;
      }
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
      width: 8.75rem;
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