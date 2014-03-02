### RefugeRestrooms - App Server
===================================
A RESTful web API for [Refuge Restrooms](http://www.refugerestrooms.org).

### Installation

1. Download & install the latest version of node.js at [http://nodejs.org](http://nodejs.org).

2. Dowlond & install the Heroku toolbelt at [https://toolbelt.heroku.com](https://toolbelt.heroku.com).

3. Clone the git repository:

```javascript
$ git clone git@github.com:tkwidmer/refugerest_sms.git
```

4. Install third-party modules from npm:

```javascript
$ cd refugerest_sms
$ npm install
```

5. Create a .env file for local environment variables. You'll need to set the following values:

    - PG_NATIVE
    - DATABASE_URL
    - TWILIO_ACCOUNT_SID
    - TWILIO_AUTH_TOKEN

6. Start the server!

```javascript
$ foreman start
```
