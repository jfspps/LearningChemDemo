# LearningChemistry
Web app files for LearningChem. Run `node app.js` from the primary directory and enter `localhost:8080` in a web browser.

## Installing MongoDB on Linux Mint 20 (required to handle the Feedback form)

Install MongoDB using the DEB package for Ubuntu 20.04, [set](https://fantinel.dev/mongodb-error-datadb-on-linux/) the /data/db directories with `sudo mkdir -p /data/db/` and set ownership to yourself with `sudo chown 'id -u' /data/db`.

Then follow the [official instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) to enable on startup of mongod as a daemon.

Finally, install the DEB package for the Mongo shell (mongo) and proceed with the [superuser authentication](https://docs.mongodb.com/guides/server/auth/).

The following will prove relevant to the authentication process. Select the database `admin` with `use admin` at the mongo console and then type:

```json
db.createUser(
  {
    user: "superuser",
    pwd: "somePassword",
    roles: [ "root" ]
  }
)
```

This secures MongoDB. Change the user and pwd as required, remembering to change the corresponding parameters in `app.js`. The database for LearningChem (eventually labelled 'feedback') is saved automatically and need not be initialised.

After entering `mongo` at the console, typing `help` will list common functions. The command `show dbs` shows the databases and their disk usage currently stored in /data/db. Creating new and accessing current databases is achieved using `use databaseName`.

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/).
