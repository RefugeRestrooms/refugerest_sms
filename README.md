### RefugeRestrooms: SMS Server
###### A RESTful web API for SMS search by [RefugeRestrooms](http://www.refugerestrooms.org).
===================================

### Local Installation:

Download & install the latest version of node.js at [http://nodejs.org](http://nodejs.org).

Download & install the Heroku toolbelt at [https://toolbelt.heroku.com](https://toolbelt.heroku.com).

Clone the git repository:
```javascript
$ git clone git@github.com:tkwidmer/refugerest_sms.git
```

Install third-party modules from npm:
```javascript
$ cd refugerest_sms
$ npm install
```

Create a .env file under the server's root for local environment variables. You'll need to set the following values:
```
PG_NATIVE=true
DATABASE_URL=[YOUR_POSTGRES_CONNECTION_URL]
TWILIO_ACCOUNT_SID=[YOUR_TWILIO_SID]
TWILIO_AUTH_TOKEN=[YOUR_TWILIO_AUTH_TOKEN]
```

Start the server!
```javascript
$ foreman start
```
