FROM bfhlcontainerregistry.azurecr.io/bfhlnode:1.0.0

USER node

WORKDIR /home/node


COPY package.json package.json

RUN pnpm install --only=production

COPY . . 

EXPOSE 5000

CMD ["sh","-c","pnpm start"]
