FROM docker.elastic.co/logstash/logstash:8.14.3

EXPOSE 9600
# 5044 for beats

# RUN mv /usr/share/logstash/pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.conf.bak
COPY logstash.conf / 

USER root

RUN chown -R logstash:logstash /logstash.conf
RUN chown -R logstash:logstash /usr/share/logstash/data
RUN mv /logstash.conf /usr/share/logstash/pipeline/logstash.conf
RUN chmod -R u+rw,g+rw,o+rw /usr/share/logstash/data

USER logstash