# Cookie extension

Chromium extension to help users understanding cookies on their computer and trackers on the web. In addition to passive actions (analysis), actives actions are provided to automatically help users (i.e.: cookies deletion).

## Features

Currently, all the features have to be developed. At the end of the project, we would like to have cookie actions (analysis, deletions, whitelist...), tracker actions (analysis, whitelist...), a popup and a management dashboard.

### Cookies

For each website, the extension analyzes all its cookies (including thoses for advertising, proper functioning, analytics...).

List of passives actions :
- Basic analysis: analyzing its attributes (domain, size, expiracy date...) and numbers of cookies stored,
- Classification: detecting the type of the cookie (advertising, analytics, proper functioning...).

Also, automated tasks can help users to get rid of them.

List of actives actions:
- Automaticaly delete cookies from closed tabs,
- Clear cookies if unused for a long time,
- Block bad cookies.

### Trackers

For each website, the extension analyses its content, its script to determine if the website try to track you with your digital fingerprints or try to run some unwanted script. 

The extension makes it possible to make you untracable by spoofing your details with randoms one on each website (details configurable). 

It can block pixel script, tracking parameters, beacon requests, individual thresholds (to track you down). Blocking everything might lead into breaking some website. 

### Popup

By clicking on the extension icon (on the top right of the browser), a small popup appear. Aggregated data (cookies and trackers "score") are shown to quickly understand if the visited website is "clean" or not. Links to more informations (for cookies and trackers related actions) can be clicked on, in addition to an information button if the user wants to learn more about privacy.

### Dashboard

As the popup is too small to display all our explanations, a full page dashboard is provided. On it, user is allowed to see statistics, to set parameters (i.e.: domain blocked / whitelisted for cookies and trackers), to read static information on privacy...

## Installation

Download the projet and put in a folder.

In a chromium based browser (i.e.: Chrome), load the folder as an extension. You may have to turn on developer mode on your browser to be able to do so.

### Chrome

Open the settings menu, then go the "Extensions" section. On the top right of the windows, turn on "Developer mode". Then you can click on the "Load unpacked" button, and select the extension folder (root). The cookie extension must appear in your extensions.

## Contributors



```
Privacy Keeper Copyright (C) 2022  Bastien BARBE, Arthur DURAND, Laetitia DODO, Baptiste LALANNE, Loann LARGERON, Amine LBATH, Tom PERRILLAT-COLLOMB, David-Marcus TOMA
This is free software, and you are welcome to redistribute it
under certain conditions
```