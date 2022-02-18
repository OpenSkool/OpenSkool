<template>
  <router-view />
</template>

<style>
html,
body {
  @apply antialiased font-sans bg-warm-gray-200;
}

a {
  @apply text-orange-500;
}

code {
  @apply bg-orange-100 text-orange-900 px-2 py-1 rounded-md;
}

h1 {
  @apply text-6xl;
}

label {
  @apply mx-2 font-bold;
}
</style>
