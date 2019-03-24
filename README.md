# DEV

```bash
docker build -t playground-sdk:alpine sdk
```

## local dev

```bash
docker run -it --rm -p 3000:3000 --volume $PWD:/app playground-sdk:alpine bash
yarn start
```

## Test

```bash
curl --header "Authorization: Bearer anystring" localhost:3000/1
```
