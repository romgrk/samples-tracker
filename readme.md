
# Follow

## Development

```sh
npm run watch-css
npm run docker:dev
cd client && npm start
```

## Building

```sh
npm run build
docker-compose build
```

## Running

```sh
docker-compose run -v $DB_DATA_DIRECTORY:/var/lib/postgresql/data db
docker-compose run -p 3001:3001 -v $CONFIG_DIRECTORY:/usr/etc web
```
