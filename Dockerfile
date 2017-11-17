FROM node:8

# Binds to port 3000
EXPOSE 3000

# Working directory for application
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Creates a mount point
VOLUME [ "/usr/src/app" ]

#CMD ["./wait_for_it.sh", "postgres:5432", "--", "npm", "run", "start:dev"]
