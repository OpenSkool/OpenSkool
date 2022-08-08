FROM --platform=linux/amd64 quay.io/keycloak/keycloak:18.0.2 as builder
ENV KC_DB="postgres"
ENV KC_FEATURES="token-exchange"
# ENV KC_HEALTH_ENABLED="true"
# ENV KC_METRICS_ENABLED="true"
RUN /opt/keycloak/bin/kc.sh build

FROM --platform=linux/amd64 quay.io/keycloak/keycloak:18.0.2
COPY --from=builder /opt/keycloak/lib/quarkus/ /opt/keycloak/lib/quarkus/
ENV KC_HTTP_ENABLED="true"
ENV KC_DB_SCHEMA="public"
ENV KC_PROXY="edge"

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start"]
