<template>
  <v-container fluid fill-height class="pa-0">
    <v-row no-gutters align="center">
      <v-col cols="12" class="pb-2">
        <title-card title="dashboard"/>
        <v-divider></v-divider
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="4" lg="4" v-for="(item,n) in navItems" :key="n">
        <v-card  min-height="100" flat outlined >
          <v-list-item>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
            <v-spacer />
            <v-btn icon :to="item.to">
              <v-icon small>
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </v-list-item>
          <v-card-text>
            {{ item.items}}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card
          class="mx-auto"
          flat
          outlined
        >
          <v-card-text>
            Sales Last 24h
          </v-card-text>
          <v-card-text>
            <v-sheet >
              <v-sparkline
                :value="value"
                color="primary"
                height="100"
                padding="24"
                stroke-linecap="round"
                line-width="1"
                smooth
              >
                <template v-slot:label="item">
                  ${{ item.value }}
                </template>
              </v-sparkline>
            </v-sheet>
          </v-card-text>


        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TitleCard from '../Common/TitleCard.vue'

export default {
  name: 'Dashboard',
  title: "Home",
  components: {
    TitleCard
  },
  data() {
    return {
      loading: false,
      date: null,
      menu: false,
      navItems: [
        {title: 'Category', icon: 'mdi-checkbox-multiple-blank-outline', items: 30},
        {title: 'All Ads', icon: 'mdi-checkbox-multiple-blank-outline', items:  200},
        {title: 'All User', icon: 'mdi-checkbox-multiple-blank-outline', items:  80},

      ],
      value: [
        423,
        446,
        675,
        510,
        590,
        610,
        760,
      ],
    }
  },
  methods: {

  },
}
</script>

<style scoped>
.radius {
  border-radius: 7px;
}

</style>
