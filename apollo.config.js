module.exports = {
  client: {
    service: {
      name: 'default',
      localSchemaFile: 'api/src/api/generated/schema.graphql',
    },
    includes: ['app/src/**/*.vue'],
  },
};
