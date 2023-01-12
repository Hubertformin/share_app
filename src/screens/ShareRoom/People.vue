<template>
  <div class="h-full px-4 pb-3 bg-gray-100">

    <div class="header flex items-center justify-between">
      <div class="flex items-center gap-1">
        <h1 class="text-lg mb-0 font-bold">People</h1>
        <span class="text-2xl">&bullet;</span>
        <p v-if="roomDevices.length > 0" class="mb-0 text-slate-600">
          {{roomDevices.length + ' ' + (roomDevices.length > 1 ? 'devices' : 'device')}}
        </p>
      </div>
      <div class="action">
      </div>
    </div>

    <div class="body bg-white rounded-xl pt-3 px-2 border pb-6 pt-4">
      <div v-for="(device, index) in roomDevices" class="device-card flex pb-3 mb-6 border-b justify-between px-4">
        <div class="">
          <h4 class="font-bold mb-0 text-lg">{{device.name}}</h4>
          <p class="text-slate-500 mb-0"><v-icon :name="getPlatformIconClass(device.platform)" />&nbsp;{{titleCase(device.platform)}}</p>
        </div>
        <div class="action pt-3">
          <p class="text-slate-500 mb-0">{{timeAgo(device.joinedOn)}}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import {mapState} from "vuex";
import {timeAgo, titleCase} from "../../utils/strings";

export default {
  name: "People",
  computed: {
    ...mapState(['roomDevices'])
  },
  methods: {
    timeAgo,
    titleCase,
    getPlatformIconClass(platform: string): string {
      const search = platform.toLowerCase();
      if (search.includes('macos') || search.includes('ios')) return 'bi-apple';
      if (search.includes('windows')) return 'io-logo-windows';
      if (search.includes('linux')) return 'fa-linux';
      if (search.includes('android')) return 'pr-android';
      return 'md-device-unknown'
    }
  }
}
</script>

<style scoped lang="scss">
$header-height: 50px;
.header {
  height: $header-height;
}
.body {
  height: calc(100% - $header-height);
  overflow-y: auto;
}
</style>