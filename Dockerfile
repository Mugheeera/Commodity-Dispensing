FROM node:14
WORKDIR /usr/src/app
RUN yarn global add @dhis2/cli
EXPOSE 3000 
EXPOSE 9999