# OpenSkool App

## Development

Run `yarn workspace @os/app dev` to start the api in development mode.

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
