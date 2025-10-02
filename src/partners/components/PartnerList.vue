<script setup lang="ts">
import partnersRaw from '../partners.json'
import PartnerCard from './PartnerCard.vue'
import { Partner } from './type'
import CardList from '@theme/components/CardList.vue'
import { computed } from 'vue'

const props = defineProps<{
  filter?: (p: Partner) => boolean | undefined
  showLinkToAll?: boolean
}>()

const adaptedFilter = computed(() => {
  if (!props.filter) return undefined
  return (item: any): boolean => {
    const partner = item as Partner
    const result = props.filter?.(partner)
    return result ?? true
  }
})
</script>

<template>
  <CardList
    :items="partnersRaw"
    :filter="adaptedFilter"
    :cardComponent="PartnerCard"
    :showLinkToAll="props.showLinkToAll"
    browseLinkText="Посмотреть других разработчиков"
    browseLinkUrl="./all.html"
    shuffleItems
  />
</template>