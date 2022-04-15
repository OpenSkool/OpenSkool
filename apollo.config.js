module.exports = {
  client: {
    service: {
      name: 'default',
      localSchemaFile: 'app/src/generated/schema.graphql',
      url: 'http://localhost:3030/graphql',
    },
    includes: ['app/src/**/*.{gql,vue}'],
  },
};
