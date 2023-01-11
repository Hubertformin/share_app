<template>
<div class="h-full px-4 pb-3">
  <div class="header">
    <h1 class="text-lg font-bold">Transfer Hub</h1>
  </div>
  <div class="body">

  </div>
  <div class="foot">
    <div class="dropzone flex justify-center items-center">
      <v-icon name="bi-plus-square-dotted" scale="1.5" fill="#00488d" />
      <h4 class="ml-2 font-semibold mb-0 text-blue-900">Click or Drop files here to send</h4>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
$header-height: 50px;
$footer-height: 70px;
.header {
  height: $header-height;
}
.body {
  height: calc(100% - ($header-height + $footer-height));
  overflow-y: auto;
}
.foot {
  height: $footer-height;
  position: relative;
  .dropzone {
    height: 100%;
    border-radius: 12px;
    border: 1px solid #83bef8;
    background-color: #f6fcff;
  }
}
</style>

<script>
export default {
  name: "TransferHub"
}
</script>

<style scoped>

</style>