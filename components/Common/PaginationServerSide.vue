<template>
  <!-- eslint-disable vue/no-template-shadow  -->
  <v-container fluid class="pa-0">
    <v-card
      class="pa-0 pb-4 mt-4"
      style="background-color: transparent"
      flat
      color="transparent"
    >
      <v-row justify="space-between">
        <v-col v-if="!isMini" cols="12" md="6" sm="12">
          <span
            :class="
              bp.mdAndUp
                ? 'mr-4 grey--text'
                : 'mr-4 grey--text caption text-start'
            "
          >
            {{ $t('records_per_page') }}
            <v-menu :disabled="serverSide" offset-y right>
              <template #activator="{ on, attrs }">
                <v-chip
                  close-icon="mdi-delete"
                  pill
                  small
                  primary
                  v-bind="attrs"
                  color="primary"
                  :disabled="serverSide"
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
                  class="black--text small"
                >
                  <v-list-item-title
                    v-model="itemsPerPage"
                    class="black--text small cursor-pointer"
                    @click.prevent="setPerPageNumber(title)"
                    >{{ title }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
            {{
              ' ' +
              $t('showing') +
              ' ' +
              recordNumber +
              $t(' of ') +
              recordTotal +
              ' ' +
              $t('records')
            }}
          </span>
        </v-col>
        <!-- <v-spacer></v-spacer> -->
        <v-col
          cols="12"
          sm="6"
          :md="isMini ? 12 : 6"
          :align="bp.mdAndUp ? 'right' : 'left'"
        >
          <span
            :class="
              bp.mdAndUp
                ? 'mr-4 grey--text'
                : 'mr-4 grey--text caption text-start'
            "
          >
            {{
              $t('viewing_page') +
              ' ' +
              currentPage +
              ' ' +
              $t('of') +
              ' ' +
              lastPage
            }}
          </span>
          <v-chip
            :disabled="currentPage === 1 || paginateLoading"
            close-icon="mdi-delete"
            class="rounded-br-0 rounded-tr-0"
            pill
            :small="bp.mdAndUp"
            :x-small="bp.smAndDown"
            :color="isMini ? 'primary black--text' : 'white black--text'"
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
            :color="isMini ? 'primary black--text' : 'white black--text'"
          >
            {{ currentPage }}
          </v-chip>
          <v-chip
            :disabled="currentPage === lastPage || paginateLoading"
            close-icon="mdi-delete"
            class="rounded-l-0 rounded-r-0 mx-0"
            :small="bp.mdAndUp"
            :x-small="bp.smAndDown"
            dark
            :color="isMini ? 'primary black--text' : 'white black--text'"
            @click="nextPage"
          >
            <v-icon color="black">mdi-chevron-right</v-icon>
          </v-chip>

          <v-menu :disabled="serverSide" offset-y left>
            <template #activator="{ on, attrs }">
              <v-chip
                close-icon="mdi-delete"
                class="rounded-bl-0 rounded-tl-0 mx-0"
                pill
                :small="bp.mdAndUp"
                :x-small="bp.smAndDown"
                dark
                v-bind="attrs"
                :color="isMini ? 'primary black--text' : 'white black--text'"
                :disabled="serverSide"
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
                class="black--text small"
                cursor="pointer"
              >
                <v-list-item-title
                  v-model="itemsPerPage"
                  class="black--text small cursor-pointer"
                  @click="setPerPageNumber(title)"
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
  name: 'PaginationServerSide',
  props: {
    store: String,
    collection: String,
    dispatchTo: String,
    setCurrentPage: String,
    setPerPage: String,
    filterobj: Object,
    filterObjPage: Number,
    filterPerPage: Number,
    loading: Boolean,
    isMini: Boolean
  },

  data() {
    return {
      serverSide: false,
      paginateLoading: false,
      // itemsPerPage: 10,
      itemsPerPageArray: [5, 10, 15, 20, 25, 50],
      title: null
      // perPageName: 'SET_GIFT_PER_PAGE'
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.$store.state[this.store][this.collection].current_page
      },
      set(value) {
        this.$store.commit(this.store + this.setCurrentPage, value)
      }
    },
    lastPage: {
      get() {
        return this.$store.state[this.store][this.collection].last_page
      }
    },
    itemsPerPage: {
      set(value) {
        this.$store.commit(this.store + this.setPerPage, parseInt(value))
      },
      get() {
        return this.$store.state[this.store][this.collection].per_page
      }
    },
    recordNumber: {
      get() {
        return this.$store.state[this.store][this.collection].to
      }
    },
    recordTotal: {
      get() {
        return this.$store.state[this.store][this.collection].total
      }
    }
  },
  watch: {
    currentPage(newVal, oldVal) {
      this.paginatePage(newVal)
    },
    itemsPerPage(newVal, oldVal) {
      this.paginatePerPageShow(newVal)
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage + 1 <= this.lastPage) {
        this.currentPage += 1
      }
    },
    formerPage() {
      if (this.currentPage - 1 >= 1) {
        this.currentPage -= 1
      }
    },
    setPerPageNumber(perPage) {
      this.itemsPerPage = parseInt(perPage)
      this.page = 1
    },
    async paginatePage(pageNumber) {
      this.paginateLoading = true

      if (this.filterobj) {
        this.$emit('update:filterObjPage', pageNumber)
        try {
          this.$emit('update:loading', true)
          await this.$store.dispatch(
            this.store + this.dispatchTo,
            this.filterobj
          )
        } catch (e) {
          this.$toast.error(e.response.data.message)
        } finally {
          this.$emit('update:loading', false)
          this.paginateLoading = false
        }
      } else {
        try {
          this.$emit('update:loading', true)
          await this.$store.dispatch(this.store + this.dispatchTo, pageNumber)
        } catch (e) {
          this.$toast.error(e.response.data.message)
        } finally {
          this.$emit('update:loading', false)
          this.paginateLoading = false
        }
        // this.$store
        //   .dispatch(this.store + this.dispatchTo, pageNumber)
        //   .catch((error) => {
        //     this.$toast.error(error.response.data.message)
        //   })
        //   .finally(() => {
        //     this.paginateLoading = false
        //   })
      }
    },
    async paginatePerPageShow(perPageNumber) {
      // console.log(perPageNumber)
      this.paginateLoading = true
      if (this.filterobj) {
        this.$emit('update:filterPerPage', perPageNumber)
        try {
          this.$emit('update:loading', true)
          await this.$store.dispatch(
            this.store + this.dispatchTo,
            this.filterobj
          )
        } catch (e) {
          this.$toast.error(e.response.data.message)
        } finally {
          this.$emit('update:loading', false)
          this.paginateLoading = false
        }
      } else {
        try {
          this.$emit('update:loading', true)
          await this.$store.dispatch(
            this.store + this.dispatchTo,
            perPageNumber
          )
        } catch (e) {
          this.$toast.error(e.response.data.message)
        } finally {
          this.$emit('update:loading', false)
          this.paginateLoading = false
        }
      }
    }
  }
}
</script>
<style>
.cursor-pointer {
  cursor: pointer;
}
</style>
