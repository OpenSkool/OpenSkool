FROM quay.io/keycloak/keycloak:19.0.1 as builder
ENV KC_DB="postgres"
ENV KC_FEATURES="token-exchange"
# ENV KC_HEALTH_ENABLED="true"
# ENV KC_METRICS_ENABLED="true"
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:19.0.1
COPY --from=builder /opt/keycloak/lib/quarkus/ /opt/keycloak/lib/quarkus/

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized"]
