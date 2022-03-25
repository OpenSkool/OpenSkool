<template>
  <ol class="flex breadcrumb">
    <slot></slot>
  </ol>
</template>

<style scoped>
:global(.breadcrumb li + li::before) {
  display: inline-block;
  float: left;
  content: ' ';
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTEyLjE3MiAxMkw5LjM0MyA5LjE3MmwxLjQxNC0xLjQxNUwxNSAxMmwtNC4yNDMgNC4yNDMtMS40MTQtMS40MTV6Ii8+PC9zdmc+Cg==');
  background-repeat: none;
  margin: 0 1em;
  width: 24px;
  height: 24px;
}
:global(.breadcrumb a) {
  @apply underline;
}
</style>
