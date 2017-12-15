
# Follow

#### General structure
```
.
├── bin/www     -- starts the application
├── client      -- all front-end files are here
│   ├── build       -- autogenerated. Is copied at /public on `npm run build`
│   │   └── static
│   │       ├── css
│   │       ├── js
│   │       └── media
│   ├── docs
│   │   └── create-redux-app
│   ├── public
│   └── src
│       ├── actions
│       ├── assets
│       ├── components
│       ├── constants
│       ├── containers
│       ├── reducers
│       ├── routes
│       ├── store
│       ├── styles
│       └── utils
├── config/config.js    -- development configuration file
├── data                -- where data is stored
│   ├── db
│   └── files
├── helpers         -- general purpose utils
├── models          -- models for interacting with the database
├── public          -- autogenerated public files
│   ├── static
│   |   ├── css
│   |   ├── js
│   |   └── media
|   └── index.html
├── routes/ -- contains API routes
└── app.js -- backend app entry point
```

## Development

The first time, run:
```sh
npm run setup
# The command above will do:
#  mkdir -p data/db
#  mkdir -p data/files
#  cp -r config data/config
```

Then, let these 3 commands run in separate terminals:

```sh
npm run docker:dev
cd client && npm run watch-css
cd client && npm start
```


## Building

```sh
npm run build:all
# The command above runs the two below
npm run build:client # builds front-end
npm run build:server # builds back-end docker image
```


## Running

You will need to create three directories:

- `$DB_DATA_DIRECTORY`: This will contain the database data. It's an external
     volume that persits across docker restats.
- `$FILES_DIRECTORY`: This will contain user-uploaded files. It's also an
     external volume.
- `$CONFIG_DIRECTORY`: This will contain the application configuration (e.g.
     SMTP account, Google OAuth account, etc). It must be created by copying the
     `/config` directory of this project, and modifying the
     `$CONFIG_DIRECTORY/config.js` file accordingly.

Here is a proposed procedure to setup the directories, then start the
application:

```sh
cd $APPLICATION_DIRECTORY

mkdir -p data/db
mkdir -p data/files
cp -r config data/config

# Here, modify ./data/config/config.js as you need

export DB_DATA_DIRECTORY="$(pwd)/data/db"
export FILES_DIRECTORY="$(pwd)/data/files"
export CONFIG_DIRECTORY="$(pwd)/data/config"
export PORT=8080

docker-compose run \
  -d \
  -v $DB_DATA_DIRECTORY:/var/lib/postgresql/data \
  db

docker-compose run \
  -d \
  -v $CONFIG_DIRECTORY:/usr/etc \
  -v $FILES_DIRECTORY:/usr/share/app \
  -p $PORT:3001 \
  web
```


## Quick setup

```sh
npm run setup # creates directories
npm run build:all # builds everything
npm run docker:db # starts database (doesnt run detached)
npm run docker:web # starts app (doesnt run detached)
```

### Backups

Backup the state of the application by copying the `$DB_DATA_DIRECTORY` and
`$FILES_DIRECTORY` directories. If you followed the above procedure, both are
contained in the `/data` folder.
