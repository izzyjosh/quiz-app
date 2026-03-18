FROM node:20-alpine

# working directory
WORKDIR /app

# copy dependencies
COPY package*.json ./

# install dependencies
RUN npm install

# copy project files
COPY . .

# build typescript
RUN npm run build

# expose port
EXPOSE 8000

# start server
CMD ["node", "dist/app.js"]