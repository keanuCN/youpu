# ES 8.x + analysis-ik 中文分词（ik_max_word / ik_smart）
# 版本纪律：ik 插件版本必须与 ES 版本严格一致，ES_VERSION 由 compose 传入。
ARG ES_VERSION=8.13.4
FROM docker.elastic.co/elasticsearch/elasticsearch:${ES_VERSION}

ARG ES_VERSION
RUN bin/elasticsearch-plugin install --batch \
    "https://github.com/infinilabs/analysis-ik/releases/download/v${ES_VERSION}/elasticsearch-analysis-ik-${ES_VERSION}.zip"
