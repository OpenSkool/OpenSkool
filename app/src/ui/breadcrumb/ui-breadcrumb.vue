<template>
  <ol class="flex flex-wrap breadcrumb">
    <slot />
  </ol>
</template>

<style scoped>
:global(.breadcrumb li + li::before) {
  display: inline-block;
  float: left;
  content: ' ';
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBjbGFzcz0iaWNvbmlmeSBpY29uaWZ5LS1tZGkiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Im03IDIxbDcuOS0xOEgxN0w5LjEgMjFIN1oiPjwvcGF0aD48L3N2Zz4=');
  background-repeat: none;
  background-size: contain;
  margin: 0.15em 1em;
  width: 16px;
  height: 16px;
  font-size: 12pt;
}
</style>
