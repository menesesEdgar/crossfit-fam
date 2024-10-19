# Project creation


# Libraries installed


# install prisma, prisma is used to handle the database is an easy way.

npm i -D prisma
npx prisma init
npm i @prisma/client

# If we want to publish our prisma models we need to run the next command

npx prisma generate

# if we want to create all the models as tables and relations we need to run the next command

npx prisma db push

# Create mysql schema using docker

# Create mysql schema using docker

3. Execute next command `docker run --name musicfy -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=musicfy -p 3306:3306 -d mysql`
