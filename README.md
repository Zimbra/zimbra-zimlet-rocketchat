# Rocket Chat integration for Zimbra 9

This Zimlet will automatically create accounts for your users and will log them on to Rocket Chat automatically. The Zimlet will create accounts in Rocket Chat based on the Zimbra primary email address. So user@example.com in Zimbra becomes user.example.com in Rocket Chat. Once set-up the users can only log-in via the Zimbra log-in page this includes mobile device apps. A welcome email is send to the user with a fallback password, this can only be used in situations where the integration is disabled.

![Zimbra Rocket UI](screenshots/RocketChat-Zimbra9-ui.png)
![Zimbra Rocket sidebar](screenshots/rocket-new.png)
![Zimbra Rocket welcome](screenshots/RocketChat-Zimbra9-welcome.png)

## How to install Rocket Chat

Follow the instruction for setting up Rocket Chat using Snap on Ubuntu 18. 

- https://docs.rocket.chat/installation/snaps

## Allow API tokens to be used

    echo "CREATE_TOKENS_FOR_USERS=true" > /var/snap/rocketchat-server/common/create-tokens.env
    sudo systemctl restart snap.rocketchat-server.rocketchat-server.service

## Set up a reverse proxy

This will allow you to use TLS/SSL and configure headers needed for the integration. See the proxy-config folder for a basic example nginx/apache config.

      apt install nginx
      systemctl enable nginx   

Modify the config in `/etc/nginx/sites-enabled/default` as per the example in proxy-config folder.

      systemctl start nginx

## Choose your domain wisely

During 2020 Google and various vendors have been pushing the requirement to set cookies with the SameSite and Secure attributes.

RocketChat sets cookies on the client via Javascript and does not support configuring the SameSite attribute, which is needed for it to run on a different domain than Zimbra. This means that RocketChat needs to be installed on a subdomain similar to Zimbra. Aka zimbramail.example.com and rocketchat.example.com will work, zimbramail.example.io and rocketchat.example.com will not work.


## Setting up Zimbra
For this you need to set-up the Java server extension copy it from https://github.com/Zimbra-Community/zimbra-rocket/releases to /opt/zimbra/lib/ext/rocket/rocket.jar ( and make sure this is the only jar in this folder) then create a text file /opt/zimbra/lib/ext/rocket/config.properties with the contents:

        adminuser=adminUsername
        adminpassword=adminPassword
        rocketurl=https://rocket.example.org
        loginurl=https://mail.example.org
	enableWelcomeEmail=true

This adminuser and password you should have created when you first installed Rocket. The loginurl is the place where we point users to that have not yet authenticated. This can be your SSO login page or the Zimbra login page. Don't forget `zmmailboxdctl restart`. Do not put a / at the end of rocketurl! Make sure to configure X-Frame-Options/Access-Control-Allow-Origin on the Rocket Chat server side. You must remove this headers in a reverse proxy and add the correct ones for the integration to work. See the proxy-config for a basic example nginx/apache config.

You must also configure Rocket chat like so:
![Zimbra Rocket](https://raw.githubusercontent.com/Zimbra-Community/zimbra-rocket/master/img/zimbra-rocket-iframe.png)
Be careful, as you can easily lock yourself out if something does not work. If you want more details check: https://github.com/Zimbra-Community/zimbra-rocket/wiki/Debugging


## Configure and deploy the Zimlet:
      
Get zimbra-zimlet-rocketchat.zip for Zimbra 9 (from Github releases) and as Zimbra user:

      zmzimletctl deploy zimbra-zimlet-rocketchat.zip
      
To configure the rocketurl in the Zimlet add your url and create a config template:

      echo '<zimletConfig name="zimbra-zimlet-rocketchat" version="0.0.1">
          <global>
              <property name="rocketurl">https://rocketchat.barrydegraaff.tk/</property>
          </global>
      </zimletConfig>' > /tmp/rocket_config_template.xml
           
Import the new configuration file by the running following command:

      zmzimletctl configure /tmp/rocket_config_template.xml
	  
## Make you Zimbra Admin a Rocket Admin, creation of RocketChat Admins

Once you have enabled iframe-authentication you will not be able to log-in directly using the RocketChat log-in page. In most cases you will not be able to log in to the RocketChat administrative account. To fix this you can promote a regular user account to have an admin role. Log on to Zimbra and go to the RocketChat tab of the account you wish to use as admin and verify the account name. Example `admin@zimbra.example.com` becomes `admin.zimbra.example.com` in RocketChat. Promote this user on RocketChat server like this:

      cd /snap/rocketchat-server/current
      ./bin/mongo parties --eval 'db.users.update({username:"admin.zimbra.example.com"}, {$set: {'roles' : [ "admin" ]}})'

## Separation of tenants

This Zimlet does not separate tenants from Zimbra, so all users on your Zimbra server that have access to the RocketChat Zimlet will have an account on RocketChat and will be able to see and chat with each other. Accounts on RocketChat are created if/when the user logs-in on Zimbra. To remove a user from RocketChat you have to remove them on RocketChat and de-activate them in Zimbra or disable the RocketChat Zimlet for the user you want to remove from RocketChat.

## Set the default chat channel

RocketChat will default show the welcome page when it loads, you can change it to show the default chat channel by setting `default` in Administration -> General -> First Channel After Login.
