# RUN at root

```bash
docker run -it --rm -p 3000:3000 --volume $PWD:/app node:10.15.3-alpine sh
cd /app
yarn start
```

# Test

```bash
curl --header "Authorization: anystring" localhost:3000/1
```
