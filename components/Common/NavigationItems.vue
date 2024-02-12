<template>
  <v-list-group active-class="accentlight" no-action  @click="goto(path)" color="">
    <template #activator>
      <v-list-item-content v-show="items" dense>
        <v-list-item-subtitle>{{ title }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content v-show="!items" @click="$router.push(path)">
        <v-list-item-subtitle>{{ title }}</v-list-item-subtitle>
      </v-list-item-content>

    </template>
    <template v-slot:prependIcon>
      <v-icon>
        {{ prependIcon }}
      </v-icon>
    </template>
    <template v-slot:appendIcon>
      <v-icon small v-show="items" >
        mdi-menu-down
      </v-icon>
    </template>
    <v-list-item
      v-show="items"
      v-for="(item, i) in items"
      :key="i"
      dense
      :to="item.to"
      active-class="accentlight"
      class="mx-5"
      :ripple="false"
    >

      <v-list-item-subtitle>
        {{ item.title }}
      </v-list-item-subtitle>
      <v-list-item-icon >
        <v-icon small>mdi-menu-right</v-icon>
      </v-list-item-icon>
    </v-list-item>
  </v-list-group>
</template>

<script>
export default {
  name: 'NavigationItems',
  props: {
    prependIcon: String,
    title: String,
    items: Array,
    path: String
  },
  data(){
    return {
      active: false
    }
  },
  methods: {
    goto(path) {
      if (path) {
        this.active = true
        this.$router.push(path)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-list-item__icon .v-list-group__header__prepend-icon {
  color: #f4f4f4 !important;
}
</style>
