```vue
<template>
  <div>
    <v-card class="pa-0 pb-2" style="background-color: transparent" flat color="transparent">
      <v-container fluid fill-height class="px-0 py-2">
        <v-row class="pa-0" no-gutters align="center">
          <v-list-item class="px-0">
            <span class="py-0 kep_title text-capitalize text-center">
              {{ $t('Top Up') }}
            </span>
            <v-spacer />
          </v-list-item>
        </v-row>
      </v-container>
      <v-divider class="py-0" />
    </v-card>

    <v-row class="mb-3 mt-2">
      <v-col cols="12" md="4" lg="4" class="pt-0 mt-0">
        <v-text-field
          dense
          :placeholder="$t('Filter')"
          hide-details="auto"
          required
          single-line
          append-icon=""
          type="text"
          v-model="search"
          rounded
          outlined
        />
      </v-col>
    </v-row>

    <v-skeleton-loader v-if="loading" type="table" />

    <v-data-table
      v-else
      :headers="headers"
      :items="items"
      item-key="sl"
      class="elevation-1"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      align="center"
    />

    <v-card class="pa-0 pb-5 mt-4" style="background-color: transparent" flat color="transparent">
      <v-row>
        <v-col cols="12" md="5" sm="12" class="">
          <span :class="bp.mdAndUp ? 'mr-4 grey--text' : 'mr-4 grey--text caption text-start'">
            {{ $t('Showing ') }} {{ displayedItems }} {{ $t('of') }} {{ totalCount }}
            <v-menu offset-y left>
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  close-icon="mdi-delete"
                  pill
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  color="high"
                >
                  {{ itemsPerPage }}
                  <v-icon color="white" class="pl-2">mdi-menu-down</v-icon>
                </v-chip>
              </template>
              <v-list>
                <v-list-item
                  v-for="(title, index) in itemsPerPageArray"
                  :key="index"
                  class="black--text small"
                  @click="setPagination(title)"
                >
                  <v-list-item-title class="black--text small">
                    {{ title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            {{ $t('Rows per page') }}
          </span>
        </v-col>
        <v-spacer />
        <v-col cols="12" sm="6" md="5" :align="bp.mdAndUp ? 'right' : 'left'">
          <span :class="bp.mdAndUp ? 'mr-4 grey--text' : 'mr-4 grey--text caption text-start'">
            {{ $t('Showing page') }} {{ page }} {{ $t('of') }} {{ totalPage }}
          </span>
          <v-chip
            close-icon="mdi-delete"
            class="rounded-br-0 rounded-tr-0"
            pill
            :small="bp.mdAndUp"
            :x-small="bp.smAndDown"
            color="white black--text"
            @click="prevPage"
          >
            <v-icon color="black">mdi-chevron-left</v-icon>
          </v-chip>
          <v-chip
            close-icon="mdi-delete"
            class="rounded-l-0 rounded-r-0 px-4 mx-0"
            pill
            :small="bp.mdAndUp"
            :x-small="bp.smAndDown"
            dark
            color="white black--text"
          >
            {{ page }}
          </v-chip>
          <v-chip
            close-icon="mdi-delete"
            class="rounded-l-0 rounded-r-0 mx-0"
            :small="bp.mdAndUp"
            :x-small="bp.smAndDown"
            dark
            color="white black--text"
            @click="nextPage"
          >
            <v-icon color="black">mdi-chevron-right</v-icon>
          </v-chip>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'TopUp',
  data() {
    return {
      search: '',
      page: 1,
      itemsPerPage: 40,
      itemsPerPageArray: [5, 10, 15, 20, 25, 50],
      items: [],
      loading: false,
      totalCount: 0,
    };
  },
  computed: {
    headers() {
      return [
        { text: this.$t('Sl'), value: 'sl', class: 'accentlight', align: 'center' },
        { text: this.$t('User'), value: 'user', class: 'accentlight', align: 'center' },
        { text: this.$t('Amount'), value: 'amount', class: 'accentlight', align: 'center' },
        { text: this.$t('Status'), value: 'status', class: 'accentlight', align: 'center' },
        { text: this.$t('TrxID'), value: 'trx', class: 'accentlight', align: 'center' },
        { text: this.$t('Date'), value: 'date', class: 'accentlight', align: 'center' },
      ];
    },
    bp() {
      return this.$vuetify.breakpoint;
    },
    totalPage() {
      return Math.ceil(this.items.length / this.itemsPerPage) || 1;
    },
    displayedItems() {
      const start = (this.page - 1) * this.itemsPerPage + 1;
      const end = Math.min(this.page * this.itemsPerPage, this.items.length);
      return this.items.length > 0 ? end - start + 1 : 0;
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.loading = true;
      this.$axios
        .get('get-top-up-data')
        .then((response) => {
          this.items = response.data.data.map((item, index) => ({
            sl: index + 1,
            user: item?.user?.full_name ?? '-',
            status: item.status || '-',
            amount: item.points || 0,
            trx: item.trxID || 0,
            date: item.date || 'N/A',
          }));
          this.totalCount = this.items.length;
        })
        .catch((error) => {
          console.error('Error fetching top-up data:', error.response?.data?.message || error.message);
          this.$toast.error('Failed to load top-up data');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setPagination(value) {
      this.itemsPerPage = value;
      this.page = 1;
    },
    nextPage() {
      if (this.page < this.totalPage) {
        this.page += 1;
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page -= 1;
      }
    },
  },
};
</script>

<style scoped>
/* Add any necessary styles here, if needed */
</style>
```
