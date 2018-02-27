# WEBRTC + SIP Example
This repo contains a simple example of how to build a WebRTC application usign SIP as signaling layer.

The example by no means represents a production-ready application nor presents secure practices. 

The main objective is to show what would be the workflow in a WebRTC app tha uses SIP for signaling.

## Running the example
To run the app, you will need NodeJS and a SIP server. In this example we use Asterisk. 

After cloning the repository, open `js/main.js` and set the `domain` variable to your server address.

Then install the npm dependencies an run the application with npm start. The app will be available at https://localhost:8080

    git clone https://github.com/agilityfeat/webrtc-sip-example.git
    cd webrtc-sip-example
    npm install
    npm start

Open the app in two separate tabs, log in as users `bob` and `lucy`, and click `Call`. Note that an insecure password has been set and you definitely don't want to do this in an production environment.

## SIP Server
For the example to work you need to set up an Asterisk Server. We used version 15.

Configuration files used in this example can be found in the `asterisk-conf` folder.

## Libraries Used

* We use [http-server](https://www.npmjs.com/package/http-server) to serve the files.
* We use [jssip](http://jssip.net/) for sip support
* We use [sdp-interop-sl](https://github.com/StarLeafAPIs/sdp-interop-sl) for making some required adjustments to sdp in chrome
