<template>
  <v-container fluid class="pa-0">
    <v-card
      class="pa-0 pb-4 mt-4"
      style="background-color: transparent"
      flat
      color="transparent"
    >
      <v-row>
        <v-col cols="12" md="5" sm="12" class="">
          <span
            :class="
              bp.mdAndUp
                ? 'mr-4 grey--text'
                : 'mr-4 grey--text caption text-start'
            "
          >
            <!-- {{ $t('showing_items') }} {{ page }} {{ $t('of') }} {{ itemsLength }} -->
            {{ $t('rows_per_page') }}
            <v-menu offset-y right>
              <template #activator="{ on, attrs }">
                <v-chip
                  close-icon="mdi-delete"
                  pill
                  small
                  dark
                  v-bind="attrs"
                  color="primary"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon color="white" class="pl-2">mdi-menu-down</v-icon>
                </v-chip>
              </template>
              <v-list>
                <v-list-item
                  v-for="(title, index) in itemsPerPageArray"
                  :key="index"
                  link
                  class="black--text small"
                >
                  <v-list-item-title
                    v-model="itemsPerPage"
                    class="black--text small"
                    @click="setItemNumber(title)"
                    >{{ title }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="5" :align="bp.mdAndUp ? 'right' : 'left'">
          <span
            :class="
              bp.mdAndUp
                ? 'mr-4 grey--text'
                : 'mr-4 grey--text caption text-start'
            "
          >
            {{ $t('showing_page') }} {{ page }} {{ $t('of') }}
            {{ numberOfPages }}
          </span>
          <v-chip
            :disabled="page === 1"
            close-icon="mdi-delete"
            class="rounded-br-0 rounded-tr-0"
            pill
            :small="bp.mdAndUp"
            :x-small="bp.smAndDown"
            color="white black--text"
            @click="formerPage"
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
            :disabled="page === numberOfPages"
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
          <v-menu offset-y left>
            <template #activator="{ on, attrs }">
              <v-chip
                close-icon="mdi-delete"
                class="rounded-bl-0 rounded-tl-0 mx-0"
                pill
                :small="bp.mdAndUp"
                :x-small="bp.smAndDown"
                dark
                v-bind="attrs"
                color="white black--text"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon color="black" class="pl-2">mdi-menu-down</v-icon>
              </v-chip>
            </template>
            <v-list>
              <v-list-item
                v-for="(title, index) in itemsPerPageArray"
                :key="index"
                link
                class="black--text small"
              >
                <v-list-item-title
                  v-model="itemsPerPage"
                  class="black--text small"
                  @click="setItemNumber(title)"
                  >{{ title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'PaginationClientSide',
  props: {
    itemsLength: Number,
    perPage: Number,
    currentPage: Number
  },
  data() {
    return {
      itemsPerPage: this.perPage, // 10,
      itemsPerPageArray: [5, 10, 15, 20, 25, 50, this.itemsLength],
      page: this.currentPage, // 1,
      title: null
    }
  },
  computed: {
    numberOfPages() {
      // return Math.ceil(this.items.length / this.itemsPerPage)
      return Math.ceil(this.itemsLength / this.itemsPerPage)
    }
  },

  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) {
        this.page += 1
        this.$emit('update:currentPage', this.page)
      }
    },
    formerPage() {
      if (this.page - 1 >= 1) {
        this.page -= 1
        this.$emit('update:currentPage', this.page)
      }
    },
    setItemNumber(data) {
      this.itemsPerPage = parseInt(data)
      this.$emit('update:perPage', parseInt(data))
      this.page = 1
      this.$emit('update:currentPage', this.page)
    }
  }
}
</script>

<style lang="scss" scoped></style>
