<template>
  <div class="ui-visually-hidden">
    <slot></slot>
  </div>
</template>

<style>
.ui-visually-hidden {
  border: 0px none;
  clip: rect(0px, 0px, 0px, 0px);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0px;
  position: absolute;
  width: 1px;
  white-space: nowrap;
  overflow-wrap: normal;
}
</style>
