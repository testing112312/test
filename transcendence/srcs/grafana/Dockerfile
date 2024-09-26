FROM grafana/grafana

EXPOSE 3000

USER root
RUN apk update && apk add \
	jq \
	postgresql-client

COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh

USER grafana

ENTRYPOINT [ "/entrypoint.sh" ]
