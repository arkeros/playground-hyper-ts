FROM node:10.15.3-alpine

ARG CLOUD_SDK_VERSION=239.0.0
ENV CLOUD_SDK_VERSION=$CLOUD_SDK_VERSION

ENV PATH /google-cloud-sdk/bin:$PATH
RUN apk --no-cache add \
    curl \
    python \
    py-crcmod \
    bash \
    libc6-compat \
    openssh-client \
    git \
    gnupg 
RUN curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz && \
    tar xzf google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz && \
    rm google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz && \
    ln -s /lib /lib64 
RUN gcloud config set core/disable_usage_reporting true
RUN gcloud components install kubectl

VOLUME ["/root/.config"]

ARG SKAFFOLD_VERSION=v0.25.0
ENV SKAFFOLD_VERSION=$SKAFFOLD_VERSION

RUN curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/${SKAFFOLD_VERSION}/skaffold-linux-amd64 && \
    chmod +x skaffold && \
    mv skaffold /usr/local/bin

ARG HELM_VERSION=v2.13.1
ENV HELM_VERSION=$HELM_VERSION

RUN wget -q https://storage.googleapis.com/kubernetes-helm/helm-${HELM_VERSION}-linux-amd64.tar.gz -O - | tar -xzO linux-amd64/helm > /usr/local/bin/helm \
    && chmod +x /usr/local/bin/helm

RUN skaffold version
RUN helm version --client
RUN gcloud --version
WORKDIR /app