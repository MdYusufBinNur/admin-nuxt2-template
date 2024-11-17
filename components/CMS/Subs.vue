<template>
  <div>
    <v-row>
      <v-col cols="12" class="pb-2">
        <TitleCard title="sub district"/>
        <v-divider/>

      </v-col>
    </v-row>

    <v-card class="pa-0 pb-5" style="background-color: transparent" flat color="transparent">
      <v-row>

        <v-col cols="6" sm="4" md="4" class="pt-0 mt-0">
          <v-text-field
            rounded
            color="primary"
            background-color="white"
            :placeholder="$t('Filter')"
            hide-details="auto"
            required
            outlined
            dense
            single-line
            append-icon="mdi-magnify"
            type="text"
            v-model="search"
            clearable
          ></v-text-field>
        </v-col>

        <v-spacer v-show="bp.mdAndUp"></v-spacer>
        <v-col cols="12" sm="6" md="5" :align="bp.mdAndUp ? 'right' : 'left'" class="mt-5 pt-0">
          <v-btn rounded class="secondary px-10 text-capitalize" @click="openDialog">
            Add New
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-skeleton-loader
      v-if="loading"
      type="table"
    ></v-skeleton-loader>
    <v-data-table
      v-else
      :headers="headers"
      :items="items"
      item-key="name"
      class="elevation-1"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      align="center"
      :header-props="{ sortIcon: null }"
    >

      <template #item.action="{item}">
        <v-btn icon plain small color="red" @click.prevent="openDeleteDialog(item)" >
          <v-img contain :src="trashIcon" aspect-ratio="2"/>
        </v-btn>
        <v-btn icon plain small color="primary" @click.prevent="openEditDialog(item)">
          <v-img contain :src="editIcon" aspect-ratio="2"/>
        </v-btn>
      </template>
    </v-data-table>

    <v-card class="pa-0 pb-5 mt-4" style="background-color: transparent" flat color="transparent">
      <v-row>
        <v-col cols="12" md="5" sm="12" class="">
         <span :class="bp.mdAndUp ? 'mr-4 grey--text' : 'mr-4 grey--text caption text-start'">
            {{ $t('Showing pages') }} {{ page }} {{ $t('of') }} {{ items.length }}
           <v-menu offset-y left>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                close-icon="mdi-delete"
                pill
                small
                dark
                v-bind="attrs" v-on="on"
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
              >
                <v-list-item-title class="black--text small" v-model="itemsPerPage"
                                   @click="setItemNumber(title)">{{ title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
           {{ $t('Rows per page') }}
          </span>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="5" :align="bp.mdAndUp ? 'right' : 'left'">
          <span :class="bp.mdAndUp ? 'mr-4 grey--text' : 'mr-4 grey--text caption text-start'">
            {{ $t('Showing page') }} {{ page }} {{ $t('of') }} {{ numberOfPages }}
          </span>
          <v-chip
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
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                close-icon="mdi-delete"
                class="rounded-bl-0 rounded-tl-0 mx-0"
                pill
                :small="bp.mdAndUp"
                :x-small="bp.smAndDown"
                dark
                v-bind="attrs" v-on="on"
                color="white black--text"
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
              >
                <v-list-item-title class="black--text small" v-model="itemsPerPage" @click="setItemNumber(title)">{{
                    title
                  }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="650"
    >
      <v-card flat light rounded>
        <v-card-title class="pt-3 pb-0 h_primary">
          <span class="kep_title">{{ $t('Add New') }}</span>
        </v-card-title>
        <v-container grid-list-sm class="pt-0">
          <v-divider/>
          <v-row no-gutters class="pa-0">
            <v-col cols="12" class="pa-2">
              <label class="title">Select District</label>
              <v-autocomplete
                :items="districts"
                v-model="editedItem.district_id"
                item-text="name"
                item-value="id"
                hide-details="auto"
                hide-selected
                return-id
                outlined
              />
            </v-col>
            <v-col cols="12" class="pa-2">
              <label class="title">Name</label>
              <v-text-field
                hide-details
                outlined
                v-model="editedItem.name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mb-5"/>
          <v-col cols="12" align="right" class="pa-2">
            <v-card-actions class="pb-5">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                outlined
                rounded
                class="px-8"
                @click="close"
              >
                {{ $t('No') }}
              </v-btn>
              <v-btn
                v-if="editedItem.id"
                class="secondary px-8"
                rounded
                :loading="btnLoading"
                @click="updateSubs"
              >
                {{ $t('Update') }}
              </v-btn>
              <v-btn
                v-else
                class="secondary px-8"
                rounded
                :loading="btnLoading"
                @click="saveSubs"
              >
                {{ $t('yes') }}
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-col>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="390"
    >
      <v-card align="center">
        <v-card-text class="text-center pa-5 pp-body-reg-2">
          You are about to delete this, do you want to proceed?
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            outlined
            rounded
            class="px-5"
            @click="closeDeleteDialog"
          >
            {{ $t('No') }}
          </v-btn>
          <v-btn
            class="primary px-5"
            rounded
            :loading="btnLoading"
            @click="deleteSubs"
          >
            {{ $t('yes') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import editIcon from 'static/icons/editInfoColor.png'
import trashIcon from 'static/icons/trashInfo.png'
import eyeIcon from 'static/icons/eyeInfo.png'
import {mapGetters} from "vuex";
import TitleCard from "../Common/TitleCard";

export default {
  name: 'Subs',
  data() {
    return {
      search: '', editIcon, trashIcon, eyeIcon,
      btnLoading: false,
      loading: false,
      loadingSaveData: false,
      editedIndex: -1,
      dialog: false,
      dialogDelete: false,
      dialogView: false,
      itemsPerPageArray: [5, 10, 15, 20, 25, 50],
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 10,
      items: [],
      districts: [],
      active: 'Enable',
      activeList: ['Enable', 'Disable'],
      editedItem: {
        district_id: null,
        name: null
      },
      defaultItem: {
        district_id: null,
        name: null
      },
      dialogItems: {
        title: null,
        description: null,
        category: {
          name: null
        }
      },
      categoryItem: {
        name: null
      },
      categoryModal: false,

      updateActivityDialog: false
    }
  },

  components: {
    TitleCard

  },
  computed: {
    headers() {
      return [
        {text: this.$t('Name'), value: 'name', class: 'accentlight',},
        // {text: this.$t('Bn Name'), value: 'bn_name', class: 'accentlight',},
        {text: this.$t('District'), value: 'district.name', class: 'accentlight',},

        {
          text: this.$t('Url'),
          align: 'start',
          sortable: true,
          value: 'url',
          class: 'accentlight',
        },
        {text: this.$t('Action'), value: 'action', class: 'accentlight',},
      ]
    },
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys() {
      return this.keys.filter(key => key !== 'Name')
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Add New' : 'Edit'
    },
    ...mapGetters({
      //guide: 'cms/getGuides',
      subList: 'location/getActiveSubs',
      locationList: 'location/getLocations',

    })
  },
  watch: {
    // guide: {
    //   handler (nv, ov) {
    //     if (this.guide && this.guide.length) {
    //       this.items = JSON.parse(JSON.stringify(this.guide))
    //     } else {
    //       //this.initialize()
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // },
    subList: {
      handler(nv, ov) {
        if (this.subList && this.subList.length) {
          this.items = JSON.parse(JSON.stringify(this.subList))
        } else {
          this.initialize()
        }
      },
      immediate: true,
      deep: true
    },
    locationList: {
      handler(nv, ov) {
        if (this.locationList && this.locationList.length) {
          this.districts = JSON.parse(JSON.stringify(this.locationList))
        } else {
          this.initDistrict()
        }
      },
      immediate: true,
      deep: true
    },
  },

  created() {
    // this.initialize()
  },
  methods: {
    openDeleteDialog(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
    setItemNumber(data) {
      this.itemsPerPage = parseInt(data);
    },
    setActivity(data) {
      this.active = data.toString();
    },

    initDistrict() {
      this.$store.dispatch('location/initLocations');
    },
    initialize() {
      this.loading = true
      this.$store.dispatch('location/activeSubs')
        .then((response) => {
          this.items = JSON.parse(JSON.stringify(response.data.data))
        })
        .catch((error) => {
          console.log(error)
          //this.$toast.error(error.response.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    reset() {
      this.$refs.form.reset()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })

    },

    confirmDialog(data, title) {
      this.title = title
      this.updateActivityDialog = true
      this.editedItem.active = title
      this.editedItem.id = data.id
      this.editedIndex = this.items.indexOf(data)
    },
    closeDeleteDialog() {
      this.updateActivityDialog = false
      this.editedItem.active = null
      this.editedItem.id = null
      this.editedIndex = null
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialogDelete = false
    },
    makeChange() {
      this.btnLoading = true
      // this.editedItem.id = item.id;
      // this.editedItem.status = title
      this.$nextTick(() => {
        this.$axios.post('/update-district', this.editedItem)
          .then((response) => {
            if (response.data.error) {
              return this.$toast.error(response.data.message)
            }
            this.$toast.success(response.data.message)
            Object.assign(this.items[this.editedIndex], response.data.data)
            this.closeDeleteDialog()
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            this.btnLoading = false;
          })
      })
    },
    openDialog() {
      this.dialog = true
    },
    async saveSubs() {
      this.btnLoading = true
      await this.$axios.post('/subs', this.editedItem)
        .then((res) => {
          this.items.unshift(res.data.data)
          this.$toast.success(res.data.message)
          this.close()
          this.$store.dispatch('location/activeSubs')

        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    async updateSubs() {
      this.btnLoading = true
      let formData = new FormData()
      formData.append('_method', 'put')
      formData.append('name', this.editedItem.name)
      formData.append('district_id', this.editedItem.district_id)
      if (this.editedItem.url) {
        formData.append('url', this.editedItem.url)
      }
      if (this.editedItem.bn_name) {
        formData.append('bn_name', this.editedItem.bn_name)
      }
      await this.$axios.post('/subs/' + this.editedItem.id, formData)
        .then((res) => {
          Object.assign(this.items[this.editedIndex], res.data.data)
          console.log(res.data)
          this.$toast.success(res.data.message)
          this.close()
          this.$store.dispatch('location/activeSubs')
        })
        .catch((error) => {
          // console.log(error)
          this.$toast.error(error.response.data.message)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    async deleteSubs() {
      this.btnLoading = true
      await this.$axios.delete('/subs/' + this.editedItem.id)
        .then((res) => {
          this.items.splice(this.editedIndex, 1)
          this.$toast.success(res.data.message)
          this.closeDeleteDialog()
          this.$store.dispatch('location/activeSubs')
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    openEditDialog(item) {
      this.editedItem.district_id = item.district_id
      this.editedItem.id = item.id
      this.editedItem.name = item.name
      this.editedItem.bn_name = item.bn_name
      this.editedItem.url = item.url
      this.editedIndex = this.items.indexOf(item)
      Object.assign(this.editedItem, item)
      this.dialog = true
    }
  },
}
</script>

<style scoped>
.v-progress-linear__determinate {
  border-radius: inherit;
}

.radius {
  border-radius: 10px;
}
</style>
