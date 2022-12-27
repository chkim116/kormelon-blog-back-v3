#!/bin/sh

stat dev || mkdir dev

# Archive artifacts
zip dev/kormelon-api-v2.zip -r ./ -x "*.git/*" "./.circleci/*" "./.github/*" "./scripts/*" "./src/*" "./tsconfig.json"

# Setup eb config
mkdir .elasticbeanstalk
cat << EOF > .elasticbeanstalk/config.yml
deploy:
    artifact: dev/kormelon-api-v2.zip
EOF