[![Build Bundle](https://github.com/BaptisteLalanne/Privacy-Keeper/actions/workflows/ci.yml/badge.svg)](https://github.com/BaptisteLalanne/Privacy-Keeper/actions/workflows/ci.yml)

# Pricacy Keeper

Chromium extension to help users understanding cookies on their computer and trackers on the web. In addition to passive actions (analysis), actives actions are provided to automatically help users (i.e.: cookies deletion).
<p align="center">
  <img src="https://user-images.githubusercontent.com/61800805/167641547-ea1518ba-b011-4f85-92b8-db7052f709d6.png" />
</p>


Stack: React  
  
  
## Features

The extension has two interfaces:
- A popup to evaluate the currently consulted page.
- A dashboard to manage the extension options and cookies.

The aim is to make all the features of the extension understandable for web neophytes thanks to these two simple interfaces.

### Cookies

For each website, the extension analyzes all its cookies (including thoses for advertising, proper functioning, analytics...).

List of passives actions :
- Basic analysis: analyzing its attributes (domain, size, expiracy date...) and numbers of cookies stored
- Classification: detecting the type of the cookie (advertising, analytics, proper functioning...).

**Disclaimer: We sort the cookies with the machine learning model of "CookieBlock". It is possible that some cookies are misclassified. In those rare cases, if the experience on the website is deteriorated, 
we suggest you whitelist the website in question.**

Also, automated tasks can help users to get rid of them.

List of actives actions:
- Automaticaly delete cookies from closed tabs
- Clear cookies if unused for a long time
- Block bad cookies

The extension will store additional metadata about the cookies to find out when they were added, where they came from, and their type.

*It is possible to whitelist a site to keep cookies no matter the rules set*

### Trackers

For each website, the extension analyses its content, its scripts (local and external) to determine if the website try to track you with your digital fingerprint.

The extension makes it possible to make you less tracable by spoofing your details with random ones on each website (configurable details). 

### Popup

By clicking on the extension icon (on the top right of the browser), a small popup appear. Aggregated data (cookies and trackers "score") are shown to quickly understand if the visited website is "clean" or not. Links to more informations (for cookies and trackers related actions) can be clicked on, in addition to an information button if the user wants to learn more about privacy.

### Dashboard

As the popup is too small to display all our explanations, a full page dashboard is provided. On it, user is allowed to see statistics, to set parameters (i.e.: whitelisted for cookies), to read static information on privacy and manage all browser cookies. Deleting all cookies from a domain, of a certain size or of a certain type is finally easy to use. 


<p align="center">
  <img src="https://user-images.githubusercontent.com/61800805/167641261-4c5fec10-c694-4cb5-81b6-45fb1ab74eb9.png" />
</p>

## Installation

Open a terminal in root directory, then install dependencies by running
```sh
npm install
```

Once dependencies are installed, build the extension with
```sh
npm run start
```

When a file is modified (and saved), the extension is rebuilt automaticaly. On your chrome browser, load the `build` folder. Don't forget to reload the extensions (on your browser extensions page) after each modification.

To build a static version
```sh
npm run build
```

### Chrome

Open the settings menu, then go the "Extensions" section. On the top right of the windows, turn on "Developer mode". Then you can click on the "Load unpacked" button, and select the extension folder (root). The cookie extension must appear in your extensions.

## Sources

- [Cookie Block](https://github.com/dibollinger/CookieBlock)

- [FP-Inspector](https://github.com/uiowa-irl/FP-Inspector)

## Contributors

```
Copyright (C) 2022  Privacy Keeper
https://github.com/BaptisteLalanne/Privacy-Keeper
This is free software, and you are welcome to redistribute it
under certain conditions
```
