# Wake Up Clock For Raspberry PI 3Bs

![The clock after booting](https://i.imgur.com/rGboTqD.jpg?raw=true)
This is a clock that runs on a Raspberry PI 3B, and it uses a Flask server running on the back end to serve not only the clock's interface but also the management interface. I know, a whole web server for displaying a few numbers is overkill, but I paid for the whole PI and you bet yourself I'm going to use the whole PI. All jokes aside, I chose to use a web server since it would be very easy to modify, should a user want to add a functionality, and also it made it far easier to add the management interface, thus avoiding having to make a proper phone app and instead using the browser to manage the clock.

You can see the clock boot here: https://www.youtube.com/watch?v=IkyDHoyrGoo.

Here are some pictures of the management interface:

![The settings and home pages for the management interface, side by side.](https://i.imgur.com/4qdxpRs.png?raw=true)
## Installation

### Required Parts

- 1x Raspberry PI 3B (compatibility with other PIs is untested).
- 1x Micro SD Card (big enough for raspbian).
- 1x Micro USB Charger.
- Knowledge of how to install an operating system, and knowledge of how to set up systemctl services and do other sorts of tinkering (you might be able to look up how to do some of these things).
- An internet connection (WIFI/Ethernet).

### Steps

1. Install raspbian on the PI (make sure the default user is named "pi"; if the default user is not named "pi" then you will have to modify some of the service scripts).
2. Set up a kiosk mode on your raspberry PI (I used chromium for this, here is a good guide https://pimylifeup.com/raspberry-pi-kiosk/)
3. Clone https://github.com/katznboyz1/wuc-pi3b-py36f into the home directory of the user "pi".
4. Set up the services from https://github.com/katznboyz1/wuc-pi3b-py36f/tree/master/services on systemctl for your raspberry pi.
5. Start the services, and then the display should pop up with the clocks webpage.

You can access the management page by visiting the IP address printed on the bottom of the clocks webpage (the text is very faint, so look closely).

Please do not expose this PI to the internet. Just keep it on your home network, or whatever, just not the internet. This web server has no authentication so anybody can access the clock if you have it exposed, so its best to just keep it available only to your LAN.
