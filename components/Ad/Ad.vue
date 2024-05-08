<template>
  <div>
    <v-card class="pa-0 pb-2" style="background-color: transparent" flat color="transparent">
      <v-container fluid fill-height class="px-0 py-2">
        <v-row class="pa-0" no-gutters align="center">
          <v-list-item class="px-0">
        <span class="py-0 kep_title text-capitalize text-center">
         {{ $t('Ad List') }}
        </span>
            <v-spacer/>
          </v-list-item>
        </v-row>
      </v-container>
      <v-divider class="py-0"/>

    </v-card>

    <v-row class="mb-3 mt-2">

      <v-col cols="12" md="6" lg="6" class="pt-0 mt-0">
        <v-text-field
          dense
          :placeholder="$t('Filter')"
          hide-details="auto"
          required
          single-line
          append-icon=""
          type="text"
          v-model="filterName"
        >
          <template v-slot:append>
            <v-btn icon text small @click.prevent="initialize(true)">
              <v-icon color="secondary">
                mdi-magnify
              </v-icon>
            </v-btn>
            <v-btn icon text small v-show="filterMode" @click.prevent="clearFilter">
              <v-icon color="red">
                mdi-close
              </v-icon>
            </v-btn>

          </template>
        </v-text-field>

      </v-col>
    </v-row>
    <v-skeleton-loader
      v-if="loading"
      type="table"
    ></v-skeleton-loader>
    <v-data-table
      v-else
      :headers="headers"
      :items="this.filterMode ? tempItems : items"
      item-key="name"
      class="elevation-1"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      align="center"
    >

      <template #item.image="{item}">
        <v-card flat class="py-2" max-width="100">
          <v-img
            height="100"
            width="100"
            :src="item.image"
            lazy-src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
            style="border-radius: 0"
          ></v-img>
        </v-card>

      </template>
      <template #item.status="{item}">
        <v-btn rounded x-small @click.pr.prevent="openApproveDialog(item)"
               :class="item.status === 'approved' ? 'success darken-2 text-capitalize px-3' :'primary text-capitalize px-3'">
          {{ item.status === 'approved' ? 'Approved' : 'Not Approved' }}
        </v-btn>
      </template>
      <template #item.action="{item}">
        <v-btn icon color="info" depressed>
          <v-img contain :src="editIcon" aspect-ratio="2"/>
        </v-btn>
        <v-btn icon color="danger" depressed @click="openDeleteDialog(item)">
          <v-img contain :src="trashIcon" aspect-ratio="2"/>
        </v-btn>
      </template>
    </v-data-table>

    <v-card class="pa-0 pb-5 mt-4" style="background-color: transparent" flat color="transparent">
      <v-row>
        <v-col cols="12" md="5" sm="12" class="">
         <span :class="bp.mdAndUp ? 'mr-4 grey--text' : 'mr-4 grey--text caption text-start'">
            {{ $t('Showing ') }} {{ items.length }} {{ $t('of') }} {{ totalCount }}
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
                {{ paginate }}
                <v-icon color="white" class="pl-2">mdi-menu-down</v-icon>
              </v-chip>
            </template>
            <v-list>
              <v-list-item
                v-for="(title, index) in itemsPerPageArray"
                :key="index"
                class="black--text small"
                selectable
              >
                <v-list-item-title class="black--text small" v-model="paginate"
                >{{ title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
           {{ $t('Rows per page') }}
          </span>
        </v-col>
        <v-spacer></v-spacer>
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
                {{ paginate }}
                <v-icon color="black" class="pl-2">mdi-menu-down</v-icon>
              </v-chip>
            </template>
            <v-list>
              <v-list-item
                v-for="(title, index) in itemsPerPageArray"
                :key="index"
                class="black--text small"
              >
                <v-list-item-title class="black--text small" v-model="paginate" @click="setPagination(title)">{{
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
      v-model="dialogDelete"
      persistent
      max-width="390"
    >
      <v-card align="center">
        <v-card-text class="text-center pa-5 pp-body-reg-2">
          You are about to delete {{ editedItem.name }}, do you want to proceed?
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
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
            @click="makeDelete"
          >
            {{ $t('yes') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="approveDialog"
      persistent
      max-width="390"
    >
      <v-card align="">
        <v-card-title class="pb-0">
          Change Status
        </v-card-title>
        <v-card-text class="text-caption">
          You are about to change the status, do you want to proceed?
        </v-card-text>
        <v-select
          label="Select Status"
          class="px-5 text-capitalize"
          :items="['approved','not_approved']"
          v-model="approvalStatus"
          outlined dense hide-details="auto"
          hint="Select the approval"/>
        <v-card-actions class="pb-5">
          <v-btn
            color="primary"
            outlined
            rounded
            class="px-5"
            @click="closeApproveDialog"
          >
            {{ $t('No') }}
          </v-btn>
          <v-btn
            class="primary px-5"
            rounded
            :loading="btnLoading"
            @click.prevent="makeApprove"
          >
            {{ $t('yes') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addCreditDialog"
      persistent
      max-width="390"
    >
      <v-card align="">
        <v-card-title class="pb-0">
          Add Credit
        </v-card-title>
        <v-card-text class="text-caption">
          You are about to add credit to specific user,
        </v-card-text>
        <v-select
          label="Select User"
          class="px-5"
          :items="['Yusuf','Zobayer','Ahmed', 'Asif', 'Tisha']"
          outlined dense hide-details="auto"
        />
        <v-text-field
          outlined dense type="number" hide-details="auto" class="px-5 py-5" label="Enter Amount">

        </v-text-field>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            rounded
            class="px-5"
            @click="closeAddCreditDialog"
          >
            {{ $t('No') }}
          </v-btn>
          <v-btn
            class="primary px-5"
            rounded
            :loading="btnLoading"
            @click=""
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
import {mapGetters} from 'vuex'
import editIcon from "static/icons/editInfoColor.png";
import trashIcon from "static/icons/trashInfo.png";

export default {
  name: 'Account',
  data() {
    return {
      editIcon,
      trashIcon,
      title: null,
      approveDialog: false,
      addCreditDialog: false,
      search: '',
      approvalStatus: null,
      filterName: null,
      calories: '',
      dialog: false,
      itemsPerPageArray: [5, 10, 15, 20, 25, 50],
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 10,
      items: [
        {
          user_id: 1,
          name: 'John Doe',
          amount: '1000',
          mobile: '1234567890',
          status: 'not_approve',
          trxID: 'txR23SAF',
          action: 'Edit'
        },
        {
          user_id: 2,
          name: 'Jane Smith',
          amount: '2000',
          mobile: '9876543210',
          status: 'approved',
          trxID: 'txR23SAF',
          action: 'Delete'
        },
      ],
      tempItems: [],
      subDistVal: null,
      sub_districts: [],
      filteredItems: [],
      sortIconFor: '',
      sortIcons: false,
      active: 'Enable',
      activeList: ['Enable', 'Disable'],
      loading: false,
      btnLoading: false,
      subDistLoading: false,
      loadingSaveData: false,
      usersMetadata: {
        count: 10,
        current_page: 1,
        last_page: 1,
        next_page: 1,
        next_page_url: null,
        per_page: "10",
        prev_page: 0,
        prev_page_url: null,
        total: 10,
        total_page: 1,
      },
      dialogDelete: false,
      editedIndex: null,
      locations: [],
      totalPage: 1,
      nextPageUrl: null,
      previousPageUrl: null,
      paginate: 10,
      currentPage: null,
      nextPage: null,
      prevPage: null,
      totalCount: 0,
      filterMode: false,
      editedItem: {
        first_name: null,
        last_name: null,
        mobile: null,
        email: null,
        gender: null,
        district_id: null,
        sub_district_id: null,
        address: null,
      },
      defaultItem: {
        first_name: null,
        last_name: null,
        mobile: null,
        email: null,
        gender: null,
        district_id: null,
        sub_district_id: null,
        address: null,
      },
      dialogItems: {
        first_name: null,
        last_name: null,
        mobile: null,
        email: null,
        gender: null,
        district_id: null,
        sub_district_id: null,
        address: null,
      },
    }
  },
  computed: {
    headers() {
      return [
        {text: this.$t('Image'), value: 'image', class: 'accentlight',},
        {
          text: this.$t('Name'),
          sortable: true,
          value: 'title',
          class: 'accentlight text-capitalized',
          sortIcon: 'mdi-menu-up',
          align: 'center'
        },
        {
          text: this.$t('Price'),
          sortable: true,
          value: 'price',
          class: 'accentlight text-capitalized',
          sortIcon: 'mdi-menu-up',
          align: 'center'
        },
        {
          text: this.$t('Ad type'),
          sortable: true,
          value: 'product_type',
          class: 'accentlight text-capitalized',
          sortIcon: 'mdi-menu-up',
          align: 'center'
        },
        {
          text: this.$t('Mobile'),
          value: 'contact_number',
          class: 'accentlight',
        },
        {text: this.$t('Status'), value: 'status', class: 'accentlight',},
        {text: this.$t('Action'), value: 'action', class: 'accentlight',},
      ]
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Add New' : 'Edit'
    },

  },
  created() {
    // this.$root.$on('filterUserData', () => {
    //   this.dashboardFilterMode = true
    // })
    // this.$root.$on('clearFilterMode', () => {
    //   this.dashboardFilterMode = false
    //   this.$store.commit('user/setFilteredUsers', [])
    // })

    this.initialize(this.filterMode)
  },
  methods: {
    initialize(item) {
      this.loading = true
      this.$axios.get('ads')
        .then((res) => {
          console.log(res)
          this.items = res.data.data.products
          this.paginationMetadata = res.data.data.pagination
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    openDeleteDialog(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    openApproveDialog(item) {
      this.editedItem = Object.assign({}, item)
      this.editedIndex = this.items.indexOf(item)
      this.approveDialog = true
    },
    closeDeleteDialog() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialogDelete = false
    },
    openAddCreditDialog() {
      this.addCreditDialog = true
    },
    closeAddCreditDialog() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
      this.addCreditDialog = false
    },
    closeApproveDialog() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
      this.approveDialog = false
    },

    makeApprove() {
      this.btnLoading = true
      let formData= new FormData()
      formData.append('status', this.approvalStatus)
      formData.append('_method', 'put')
      this.$axios.post(`ads/${this.editedItem.id}`, formData)
        .then((res) => {
          this.$toast.success(res.data.message)
          this.initialize()
          this.closeApproveDialog()
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message)
        })
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
