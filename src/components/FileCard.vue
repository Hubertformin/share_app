<template>
  <div class="p-16">
    <p class="text-2xl"><span :class="`${class_name} file_icon`"></span><span class="inline-block ml-3">{{filename}}</span></p>
  </div>
</template>

<style lang="css">
.file_icon::before {
  font-size: 44px;
}
</style>

<script lang="ts">
import * as fileIcons from 'file-icons.ts-js';
export default {
  data() {
    const filename = 'src/app.jpeg';
    const class_name = fileIcons.getClassWithColor(filename);
    return {
      filename,
      class_name
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>