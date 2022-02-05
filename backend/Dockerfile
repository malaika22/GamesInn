FROM alpine:latest

#adding nodejs with npm in the alpine docker image

WORKDIR /usr/src/app

#COPYING PACKAGE.JSON DIRECTORY TO THE DOCKER WORKING DIRECTORY 
COPY package.json /usr/src/app

#COPYING BUILD FOLDER TO THE DOCKER WORKING DIRECTORY
COPY build /usr/src/app

#INSTALLING NODE AND NPM 
RUN apk add --update nodejs npm 

#INSTALLING YARN 
RUN apk add yarn --no-cache

#INSTALL THE DEPENDENCIES
RUN yarn install 

EXPOSE 8002

CMD ["node","index.js"]

