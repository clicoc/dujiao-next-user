<template>
  <div v-if="channels.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <button v-for="channel in channels" :key="channel.id" @click="$emit('update:modelValue', channel.id)"
      class="text-left border rounded-xl p-4 transition-colors"
      :class="modelValue === channel.id ? 'theme-selected-surface' : 'theme-interactive-surface'">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <img v-if="channel.icon" :src="getImageUrl(channel.icon)" loading="lazy" class="h-5 w-5 rounded object-contain shrink-0" />
          <div class="theme-text-primary font-medium">{{ channel.name }}</div>
        </div>
        <span v-if="modelValue === channel.id"
          class="theme-badge theme-badge-accent theme-badge-xs px-2 py-0.5">
          {{ t('payment.selected') }}
        </span>
      </div>
      <div class="mt-2 space-y-1 text-xs theme-text-muted">
        <div>{{ t('payment.feeLabel') }}：{{ formatChannelFeeRate(channel) }}</div>
        <div>{{ t('payment.fixedFeeLabel') }}：{{ formatChannelFixedFee(channel) }}</div>
      </div>
    </button>
  </div>
  <div v-else-if="showBalanceOption" class="text-sm theme-text-muted">
    {{ t('payment.channelEmptyUseBalance') }}
  </div>
  <div v-else class="text-sm theme-text-muted">
    {{ t('payment.channelEmpty') }}
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getImageUrl } from '../../utils/image'

defineProps<{
  channels: any[]
  modelValue: number | null
  showBalanceOption: boolean
  formatChannelFeeRate: (channel?: any) => string
  formatChannelFixedFee: (channel?: any) => string
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()

const { t } = useI18n()
</script>
