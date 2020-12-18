# Readme
This Raspberry Pi project creates a voice activated remote controlled paper plane launcher.  

Why?  Why not!

It involves constructing a paper plane launncher, connecting it to a Raspberry Pi, then coding a Web App so that it can be controlled from a web page or through Google Assistant.

There are lots of parts invloved in setting this up, so start with just building a plane launcher (which is lots of fun on its own), and then over-engineer the hell out of it!  Enjoy!

As always - I stand on the shoulders of giants - where possible I have linked to the many other tutorials, libraries, tools and websites needed to provide the information to get this thing running.  It involved lots of trial and error, and many hours to build a thing that just throws paper plane.

**I found this [w3schools tutorial](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp) the best way to get started.**


## Table of contents
1. [Paper Plane Launcher](#paper-plane-launcher)
    1. [Materials](#materials)
1. [Run Web Application](#run-web-application)
1. [Add Service to run Web App at startup (optional)](#add-service-to-run-web-app-at-startup-optional-)
1. [Fixed IP Address for Raspberry Pi (optional)](#fixed-ip-address-for-raspberry-pi-optional-)
1. [Port Forwading (optional)](#port-forwading-optional-)
1. [Dynmaic DNS for domain (optional)](#dynmaic-dns-for-domain-optional-)
1. [SSL certificate for Web Server (optional)](#ssl-certificate-for-web-server-optional-)
1. [Control App using Google Actions (bonus)](#control-app-using-google-actions-bonus-)

## Paper Plane Launcher
[Instructables guide](https://www.instructables.com/Make-a-Fun-Paper-Planes-Launcher/) to creating a paper plane launcher (or google it for different designs).  I modified my final design, and encourage you to do the same, it's a lot of fun.

### Materials
- Balsa wood for frame
- 2 x DC motors (small)
- 1 x 9V battery (optional battery case/holder with on/off switch)
- Wires to connect motors to battery
- 2 x Jar Lids (must be same size)
- Elastic bands to fit around the outside of jar lids (provides traction with paper plane)

**Optional extras for automating control using Raspberry Pi**
- [1 Servo](https://components101.com/servo-motor-basics-pinout-datasheet) (for controlling catapult, used to push paperplane along launcher into spinning jar lids)
- 2 Servos (optional.  Control angle of launch pad horizontal/vertical position)
- 1 Breadboard (makes it easier to make circuit connections)
- Wires to connect Servos to breadboard/Pi

![Paper Plane Launcher](..\docs\screenshots\plane_launcher_sm.JPG "Paper Plane Launcher")


## Raspberry Pi Setup
Setup your raspberry Pi using the getting started guide: [Setting up your Raspberry Pi](https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up)

Use the standard **Raspbian OS** (as per instructions above)

On the Pi install:
- [Visual Studio Code](https://code.visualstudio.com/download) (allows you to write code directly on the Pi, or pull git repositories)
    - Select download for Linux > Debian > ARM (works for Raspberry Pi 3B+)
- Node.js: from terminal `pi@w3demopi:~ $ sudo apt-get update` 
- PiGPIO npm package: https://github.com/guymcswain/pigpio-client/wiki/Install-and-configure-pigpiod

On your PC:
- [VNC](https://www.realvnc.com/en/connect/download/viewer/) (to connect to the remote desktop of your Raspberry Pi).  This can also be installed on Android devices from the [Google Play store](https://play.google.com/store/apps/details?id=com.realvnc.viewer.android).
- [VS Code](https://code.visualstudio.com/download) (optional, but can make development quicker.  Write code on your PC, then push to a git repository)

## Run Web Application 
The application consists of a Web Server and Client.  The Web server uses ExpressJS, connecting to the client using Socket.io, and controlling the raspberry Pi GPIO pins (and connected Servos) using the [PiGPIO NPM package](https://www.npmjs.com/package/pigpio).  The client has some basic inputs for controlling the Raspberry Pi, it also logs the socket messages between the client/server for easy debugging.

Note: the PiGPIO library uses a C library, which requires administrator (sudo) access.

To run the application, execute one of the scripts defined in the package.json file, from the command line:
-  `pi@w3demopi:~ $ sudo npm run start` starts the webserver on ports 80/443 in production mode. Requires SSL certificate installed on Pi.
-  `pi@w3demopi:~ $ sudo npm run watch` starts the webserver on ports 3000 in development mode.  Development mode uses a MOCK for the PiGPIO library so you can run it from a non-Raspberry Pi machine. This uses *nodemon*, which allows you to make changes to the code, and triggers hot-reloading of the application, for quicker develpoment/testing. 

The application is now available at **http://[*raspberry_pi_IP_address*]:3000/index.html**

![Web App](..\docs\screenshots\web_screenshot_1.JPG "Web App")

## Add Service to run Web App at startup (optional)
The web app can be started when the Raspberry Pi starts.  This involve screateing a service which starts the node application.  Run the following from your project folder on the Raspberry PI.

- Copy the 2 scripts to the etc/init.d folder
- Update something (presumaby registers the service to be executed at boot)
- Reboots the Pi so the changes take effect

```bash
sudo cp /home/pi/Projects/PlaneLauncher/PlaneLauncher/scripts/plane-launcher.sh /etc/init.d/plane-launcher.sh 
sudo cp /home/pi/Projects/PlaneLauncher/PlaneLauncher/scripts/plane-launcher /etc/init.d/plane-launcher 
sudo update-rc.d plane-launcher defaults
sudo reboot
```

The service can be controlled using start/stop/restart/status

```bash
sudo service plane-launcher status
sudo service plane-launcher start
sudo service plane-launcher stop
sudo service plane-launcher restart
```



## Fixed IP Address for Raspberry Pi (optional)
On your LAN network, when devices connect to your WiFi they are dynamically assigned an IP addres (like 192.168.1.15).  This can change each time the device connects, and means the each time you want to connect to the device using VNC or SSH, or visit your web app, you would need to find out the device IP address again.  You can setup your router to use a fixed IP address for the Respabbery Pi device.  Look under the LAN settings of your router, and activate Fixed IP Addresses, and set a fixed address for your Raspberry Pi device.


## Port Forwading (optional)
Your Raspberry Pi is connected to your LAN on an address like https://192.168.1.15.  You can access this address from within your LAN, but not from the internet.  To enable access fom the internet, you will need to configure "Port Forwarding" on your WiFi router.  

Login to your router (at address like 192.168.1.1, but may be different), and then configure port Forwarding on ports 80/443 (HTTP and HTTPS) (port 3000 for development) to your Raspberry Pi Device. 

Find out your router IP address by gooogling "What is my IP", like 78.123.3.4.  You can then access you web app from this address (and port used by your web app): http://78.123.3.4:3000/index.html


## Dynmaic DNS for domain (optional)
Your internet provider probably uses Dynamic IP addresses,meaning that your IP address may change from one day to the next.  It is possible to use some online services to setup a static domain name, which connects to your dynamic IP address.  

In your router look under **Internet** settings, look at DynDNS.  Your router may allow using a number of online providers for Dynamic DNS routing.  They often allow limited free use of these serices.  I have successfully used noip.com for this.

The application is then available at **http://[*dynamic_domain*]:3000/index.html**

## SSL certificate for Web Server (optional)
To serve your web application over HTTPS, you will need to install an SSL certificate on the Raspberry Pi.  This can be done using a free certificate, and relatively easily by following the instructions from [Lets Encrypt](https://letsencrypt.org/).  
(as at 12.2020) Use the [Cert Bot tool](https://certbot.eff.org/) to install.  
- Select Certbot Instructions
- My HTTP website is running "None of the above" on "Other Linux", 
- then follow instructions.  

The application is then available at **https://[*dynamic_domain*]/index.html**

By serving over HTTPS, you can turn your Web App into a [PWA (progressive web app)](https://web.dev/progressive-web-apps/), allowing it to be installed as an app on mobile devices, and access it when the server is offline.  The webmanifest and service worker have already been created for this.

## Control App using Google Actions (bonus)
For bonus points, you can create a [Google Actions Project](https://console.actions.google.com/), and use it to control the paper plane launcher.  Then with the Google Assistant app on your android device, or Google Home device, you can control the plane launcher using voice commands.

Using webhooks, you can call intent actions using the actions route:

Google Actions webhook setting: **https://[*dynamic_domain*]/api/actions**

Currently the `/routes/actions.js` handles intents for "welcome" and "launch".

![Actions screenshot](..\docs\screenshots\actions_screenshot_0.JPG "Start screen")
![Actions screenshot](..\docs\screenshots\actions_screenshot_1.JPG "Start engines")
![Actions screenshot](..\docs\screenshots\actions_screenshot_2.JPG "Set speed")