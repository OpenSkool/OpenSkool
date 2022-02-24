# OpenSkool Api

## Development

Create a local dotenv file.

```ini
# api/.env.local
DATABASE_URL="postgresql://openskool:openskool@localhost:5432/openskool" # depends on your local postgres setup
```

Run `yarn workspace @os/api dev` to start the api in development mode.
