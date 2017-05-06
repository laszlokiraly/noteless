#!/bin/sh
npm run build
find ./build/static/js -type f -exec gzip -9 "{}" \; -exec mv "{}.gz" "{}" \;
aws s3 cp ./build s3://$NOTELESS_BUCKET/ --recursive
find ./build/static/js -type f -exec touch '{}' \;; aws s3 sync ./build/static/js s3://$NOTELESS_BUCKET/static/js --cache-control public,max-age=604800 --content-encoding gzip
