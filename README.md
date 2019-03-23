# RUN at root

```bash
# $ docker run -it --rm --network api_database-test --volume $PWD:/app node:10.15.3-alpine sh

$ docker run -it --rm -p 3000:3000 --volume $PWD:/app node:10.15.3-alpine sh
cd /app
yarn install
yarn start
```

# Test
```bash
curl --header "token: anystring" localhost:3000/1
```