FROM hashicorp/vault

RUN apk update && apk add postgresql-client

EXPOSE 8200

COPY vault-config.json /vault/config/vault-config.json
COPY vault-db.sql init-db.sh /vault/init/

RUN chmod +x /vault/init/init-db.sh
RUN sed -i 's/\r$//g' /vault/init/init-db.sh

ENTRYPOINT ["./vault/init/init-db.sh"]
# ENTRYPOINT [ "vault" ]

# CMD [ "server", "-config=/vault/config/vault-config.json" ]

# # base image
# FROM alpine:3.14

# # set vault version
# ENV VAULT_VERSION 1.8.2

# # create a new directory
# RUN mkdir /vault

# # download dependencies
# RUN apk --no-cache add \
#       bash \
#       ca-certificates \
#       wget \
#       curl

# # download and set up vault
# RUN wget --quiet --output-document=/tmp/vault.zip https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_linux_amd64.zip && \
#     unzip /tmp/vault.zip -d /vault && \
#     rm -f /tmp/vault.zip && \
#     chmod +x /vault

# # update PATH
# ENV PATH="PATH=$PATH:$PWD/vault"

# # add the config file
# COPY ./config/vault-config.json /vault/config/vault-config.json

# # expose port 8200
# EXPOSE 8200

# # run vault
# ENTRYPOINT ["vault"]