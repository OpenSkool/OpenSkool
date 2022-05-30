<template>
  <div class="card">
    <div class="card-body">
      <div
        class="bg-white flex justify-center gap-9 rounded-md text-center text-lg py-11"
      >
        <RiAlarmWarningLine />
        <div><slot /></div>
        <RiAlarmWarningLine />
      </div>
    </div>
  </div>
</template>
