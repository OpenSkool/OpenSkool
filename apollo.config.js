module.exports = {
  client: {
    service: {
      name: 'default',
      localSchemaFile: 'api/src/generated/schema.graphql',
    },
    includes: ['app/src/**/*.{gql,vue}'],
  },
};
