#!/bin/sh
npm run build
find ./build/static/js -type f -exec gzip -9 "{}" \; -exec mv "{}.gz" "{}" \;
aws s3 cp build s3://$NOTELESS_BUCKET/ --recursive
open -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome https://console.aws.amazon.com/s3/buckets/$NOTELESS_BUCKET/static/js/\?region\=us-east-1\&tab\=overview
echo "Cache-Control: public, max-age=31536000"
echo "Content-Encoding: gzip"
