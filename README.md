# liri
A command-line Language Interpretation and Recognition Interface node application. This application can provide data about a given movie or music trackb and can display the user's 20 most recent tweets.

## Technologies Used
* Node.js
* npm packages
  * twitter
  * request
  * inquirer
  * chalk 
  * figlet
  * clear
* WebStorm IDE

## Prerequisites
* Node.js
* Twitter developer account

Note: If you would like to test the program without a Twitter account, feel free but be aware that the "My Tweets" command will not work. 

## Getting Started 
1. Clone this repository with `git clone <repo url>`.
2. If you do not already have a Twitter developer account, create one with the instructions below.
3. Visit your Twitter developer account and click the Keys and Access Tokens tab to get your consume key and secret. Copy and paste them where the `<input here>` tags are inside your keys-blank.js file.
4. At the bottom of the same page, click the `Create my access token` button to get your access token key and secret. Copy the access token key and secret displayed at the bottom of the next screen. Paste them where the `<input here>` tags are inside keys-blank.js.
5. Save keys-blank.js as keys.js.
6. Add your twitter username on line 220.
6. Open a Terminal window or other Bash and navigate to the project folder. 
7. Run `npm install` to install the program's dependences. 
8. Run `node liri.js`.

## Creating a Twitter Developer account
If you want to view the Twitter functionality, you will need a Twitter developer account. If you do not already have one, follow these instructions to make one.

1. Visit https://apps.twitter.com/app/new
2. Fill out the form with dummy data. Type `http://google.com` in the Website input. Don't fill out the Callback URL input. Then submit the form.

## Author 
Mich Elliott - [mchlltt](https://github.com/mchlltt/)
