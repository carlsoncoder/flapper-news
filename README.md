# MEAN Stack Example Tutorial from Thinkster.io

This project was a result of me following the MEAN stack tutorial on [Thinkster.io](https://thinkster.io/mean-stack-tutorial/).  It's a really great tutorial that walks you through and gives you a good understanding about MEAN in general.

## Prerequisites
####*(assuming you're starting from a clean machine)*
* **Node.js / NPM** - Download and Install [Node.js](http://www.nodejs.org/download/). You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm
* **MongoDB** - Download and Install [MongoDB](http://docs.mongodb.org/manual/installation/) - Make sure `mongod` is running on the default port (27017).  Also, create a folder in the root directory (C:\ in windows, / in OSX/*nix), called \data\db (C:\data\db or /data/db).
* **GIT** - Download, Install, and Configure [Git](https://help.github.com/articles/set-up-git)

### Tools Prerequisites (all easily installed via `npm`!)
* [Bower](http://bower.io/) - Web package manager.

    ```
    $ npm install -g bower
    $ npm install -g bower
    ```

* [Gulp](http://gulpjs.com/) - JavaScript Task Runner

    ```
    $ npm install -g gulp
    $ npm install --save-dev gulp
    ```

## Additional Packages Utilized
* Express - Defined as npm module in the [package.json](package.json) file.
* Mongoose - Defined as npm module in the [package.json](package.json) file.
* Passport - Defined as npm module in the [package.json](package.json) file.
* AngularJS - Defined as bower module in the [bower.json](bower.json) file.
* Twitter Bootstrap - Defined as bower module in the [bower.json](bower.json) file.

## Getting Started After Pre-requisites
  Clone this repository into your directory via git and download dependencies

    $ [sudo] git clone [url] <dirName>
    $ cd <dirName>
    $ npm install
    $ bower install

  You should now have all required packages installed in your directory.  Simply start the server with the [Gulp](http://gulpjs.com/) command:

    $ gulp

  Once running, simply open a browser and go to:

    http://localhost:3000

## License
This code is free of license, however, referenced 3rd party components are likely bound by their own terms and licenses.