# OpenSkool App

## Development

Run `pnpm app dev` to start the api in development mode.

### Icons

We use [Remix Icon](http://remixicon.com/) and [unplugin-icons](https://github.com/antfu/unplugin-icons)
to easily add icons to our App.

Find your prefered icon in the Remix Icon search and insert into the App as follows.

```vue
<script>
import Home4Line from '~icons/ri/home-4-line';
</script>
<template>
	<home-4-line />
</template>
```

### Routes

We follow these rules of thumb when developing routes.

- Routes render layouts and components
- Only routes can access route params
- Errors are handled in a global handler
- AccessDenied / NotFound are handled in routes
- Data is fetched as late as possible

### Type-safety

Thanks to GraphQL we have end-to-end type-safety.

```mermaid
flowchart
  subgraph Api
    apisch[[GraphQL Schema]]
  end

  subgraph App
    srcdoc{{GraphQL Documents}}
    srcvue[src/**/*.vue]
    srcvue --> srcdoc
    typegen{ }
    srcdoc -.-> typegen
    gents[["src/codegen/graphql.ts"]]
    typegen -.-> |dev:generate| gents
    srcvue --> gents
  end

  apisch -.-> typegen
```

#### Source files

- `src/**/*.vue`: Our App code which contains GraphQL Documents that describe how we query the API.
  - Use `dev:generate` to generate TypeScript types that match our documents. This is done automatically and continuously when running the App during development.

#### Generated files

- `src/codegen/graphql.ts`: TypeScript types based on the Api's GraphQL Schema and our App's GraphQL Documents.
