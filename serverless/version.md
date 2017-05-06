# bumb version

## functions.js

find the version in the first lines
```
const version = "v1";
```
and bump to
```
const version = "v2";
```

## serverless.yml

case sensitive replacement of ```v1 -> v2``` and ```V1 -> V2```

# deploy

execute
```
$ serverless deploy
```

grab the lambda url and put it into config.json AWS.FUNCTIONS.INVOKE_URL, e.g. https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/v2
