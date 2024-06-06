<template>
  <div>
    <v-card class="pa-0 pb-2" style="background-color: transparent" flat color="transparent">
      <v-container fluid fill-height class="px-0 py-2">
        <v-row class="pa-0" no-gutters align="center">
          <v-list-item class="px-0">
        <span class="py-0 kep_title text-capitalize text-center">
         {{ $t('User List') }}
        </span>
            <v-spacer/>
          </v-list-item>
        </v-row>
      </v-container>
      <v-divider class="py-0"/>

    </v-card>

    <v-row class="mb-3">

      <v-col cols="12" md="6" lg="6" class="pt-0 mt-0 align-self-center ">
        <v-text-field
          rounded
          color="secondary"
          background-color="white"
          :placeholder="$t('Filter')"
          hide-details="auto"
          required
          single-line
          append-icon=""
          type="text"
          v-model="search"
          outlined
          dense
          class="py-5"
        >
          <template v-slot:append>
            <v-btn icon text small @click.prevent="initialize(true)">
              <v-icon color="secondary">
                mdi-magnify
              </v-icon>
            </v-btn>
            <v-btn icon text small v-show="filterMode">
              <v-icon color="red">
                mdi-close
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <!--        <v-btn small rounded>-->
        <!--          <v-icon left>-->
        <!--            mdi-magnify-->
        <!--          </v-icon>-->
        <!--          search-->
        <!--        </v-btn>-->
      </v-col>
      <v-col cols="12" md="6" lg="6"
             class="mt-2 pb-0  text-right">
        <v-btn  rounded class="primary text-capitalize justify-center" @click.prevent="openCreateUserDialog">
          Add User
        </v-btn>
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
      :search.sync="search"
      :page.sync="paginationMetadata.current_page"
      :items-per-page="paginationMetadata.per_page"
      hide-default-footer
      align="center"
    >


      <template #item.action="{item}">
        <v-btn icon color="info" depressed @click.prevent="openWalletDialog(item)">
         <v-icon  color="primary">
           mdi-credit-card-plus-outline
         </v-icon>
        </v-btn>
        <v-btn icon color="info" depressed @click.prevent="openDialog(item)">
<!--          <v-img contain :src="editIcon" aspect-ratio="2"/>-->
          <v-icon  color="primary">
            mdi-pencil-circle-outline
          </v-icon>
        </v-btn>
        <v-btn icon color="danger" depressed @click="openDeleteDialog(item)">
<!--          <v-img contain :src="trashIcon" aspect-ratio="2"/>-->
          <v-icon  color="red">
            mdi-close-circle-outline
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-card class="pa-0 pb-5 mt-4" style="background-color: transparent" flat color="transparent">
      <v-row class="px-5">
        <PaginationClientSide :items-length="items.length" :per-page.sync="paginationMetadata.per_page"
                              :current-page.sync="paginationMetadata.current_page"/>
      </v-row>
    </v-card>

    <v-dialog
      v-model="dialog"
      max-width="650px"
      persistent
    >
      <v-card flat light rounded>
        <v-card-title class="pt-3 pb-0 h_primary">
          <span class="kep_title_2">
            {{ $t('View') }}
          </span>
        </v-card-title>
        <v-container grid-list-sm class="pa-5">
          <v-row>
            <v-col cols="6">
              <strong>Status:</strong> {{ editedItem.status }}
            </v-col>
            <v-col cols="6">
              <v-select v-model="selectedStatus" @change="updateStatus" :items="['approved', 'pending','declined']"
                        label="Change Status" small-chips hide-details="auto" dense outlined/>
            </v-col>
          </v-row>
          <v-row>

            <v-col cols="12">
              <v-avatar>
                <img
                  :src="editedItem.photo"
                  :alt="editedItem.uid"
                >
              </v-avatar>
            </v-col>
            <v-col cols="6">
              <strong>Full Name:</strong> {{ editedItem.name }}
            </v-col>
            <v-col cols="6">
              <strong>Email:</strong> {{ editedItem.email }}
            </v-col>
            <v-col cols="6">
              <strong>UID:</strong> {{ editedItem.uid }}
            </v-col>
            <v-col cols="6">
              <strong>Phone:</strong> {{ editedItem.phone }}
            </v-col>

            <v-col cols="6">
              <strong>Role:</strong> {{ editedItem.role }}
            </v-col>
            <v-col cols="6">
              <strong>District:</strong> {{ editedItem.district }}
            </v-col>
            <v-col cols="6">
              <strong>Sub District:</strong> {{ editedItem.sub_district }}
            </v-col>
            <v-col cols="6">
              <strong>Street Address:</strong> {{ editedItem.street }}
            </v-col>
            <v-col cols="6">
              <strong>Date Of birth:</strong> {{ editedItem.dob }}
            </v-col>
            <v-col cols="6">
              <strong>Created At:</strong> {{ editedItem.created_at }}
            </v-col>
            <v-col cols="6">
              <strong>NID Front</strong>
              <div>
                <v-img width="300" height="auto" :src="editedItem.nid_one" />
              </div>
            </v-col>
            <v-col cols="6">
              <strong>NID Back</strong>
              <div>
                <v-img width="300" height="auto" :src="editedItem.nid_two" />
              </div>
            </v-col>
          </v-row>
          <v-divider class="mb-5"/>
          <v-col cols="12" align="right" class="pa-2">
            <v-btn outlined class="px-7" rounded depressed @click.prevent="closeDialog">
              {{ $t('Close') }}

            </v-btn>

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
          You are about to delete {{ editedItem.name }}, do you want to proceed?
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
            @click.prevent="makeDelete"
          >
            {{ $t('yes') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="walletDialog"
      persistent
      max-width="390"
    >
      <v-card align="center" class="pa-5">
        <v-card-text class="text-start pp-body-reg-2">
          You are about to add wallet point for {{ editedItem.name }}?
        </v-card-text>
        <v-card-actions>
          <v-text-field outlined dense v-model="walletPoint" label="Wallet point" hint="you can add any integer value" persistent-hint />
        </v-card-actions>
        <v-card-actions class="pb-5">
          <v-btn
            color="secondary"
            outlined
            rounded
            class="px-5"
            @click="closeWalletDialog"
          >
            {{ $t('No') }}
          </v-btn>
          <v-btn
            class="primary px-5"
            rounded
            :loading="btnLoading"

            @click.prevent="setWalletPoint"
          >
            {{ $t('Add Point') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="createUserDialog"
      max-width="650px"
      persistent
    >
      <v-card flat light rounded>
        <v-card-title class="pt-3 pb-0 h_primary">
          <span class="kep_title_2">{{ formTitle}}</span>
        </v-card-title>
        <v-container grid-list-sm class="pt-0">
          <v-divider/>
          <v-row no-gutters class="pa-0">
            <v-col cols="12" md="6" class="pa-2">
              <label class="title">{{ $t('Name')}}</label>
              <v-text-field
                outlined
                v-model="formDataItem.full_name"
                dense
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-2">
              <label class="title">{{ $t('Points/Credit')}}</label>
              <v-text-field
                outlined
                v-model="formDataItem.point"
                dense
                type="number"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" class="pa-2">
              <label class="title">{{ $t('Mobile')}}</label>
              <v-text-field
                outlined
                v-model="formDataItem.phone"
                dense
                type="numeric"
                hide-details="auto"
              />
            </v-col>

            <v-divider />
            <v-list-item-title class="px-2">
              Login Credentials *
            </v-list-item-title>
            <v-col cols="12" class="pa-2">
              <label class="title">{{ $t('Email')}}</label>
              <v-text-field
                outlined
                v-model="formDataItem.email"
                dense
                hide-details="auto"
                type="email"
              />
            </v-col>
            <v-col cols="12" md="12" class="pa-2">
              <label class="title">{{ $t('Password')}}</label>
              <v-text-field
                outlined
                v-model="formDataItem.password"
                dense
                type="email"
                hide-details="auto"
              />
            </v-col>

          </v-row>
          <v-divider class="mb-5"/>
          <v-col cols="12" align="right" class="pa-2">

            <v-btn outlined class="px-7" rounded depressed :loading="loadingSaveData" :disabled="loadingSaveData" @click="saveUser">
              {{ $t('Save')}}
            </v-btn>
            <v-btn outlined class="px-7" rounded depressed  @click="closeView">
              {{ $t('Close')}}
            </v-btn>

          </v-col>
        </v-container>
      </v-card>

    </v-dialog>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import editIcon from "static/icons/editInfoColor.png";
import trashIcon from "static/icons/trashInfo.png";
import PaginationClientSide from "@/components/Common/PaginationClientSide";
import error from "@/layouts/error";

export default {
  components: {PaginationClientSide},
  data() {
    return {
      editIcon,
      trashIcon,
      title: null,
      selectedStatus: null,
      createUserDialog: false,
      search: '',
      filterName: null,
      calories: '',
      dialog: false,
      walletDialog: false,
      itemsPerPageArray: [5, 10, 15, 20, 25, 50],
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 10,
      items: [],
      tempItems: [],
      subDistVal: null,
      sub_districts: [],
      filteredItems: [],
      sortIconFor: '',
      walletPoint: 0,
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
      stateLoading: false,
      formDataItem: {
        full_name: null,
        email: null,
        password: null,
        phone: null,
        point: null,
        role: 'seller'
      },
      defaultFormDataItem: {
        full_name: null,
        email: null,
        password: null,
        phone: null,
        point: null,
        role: 'seller'
      },
      editedItem: {
        name: null,
        email: null,
        uid: null,
        photo: null,
        phone: null,
        website: null,
        company: null,
        nid_one: null,
        nid_two: null,
        street: null,
        dob: null,
        about: null,
        role: null,
        email_verified_at: null,
        district: null,
        sub_district: null,
        last_activity: null,
        active: null,
        status: null,
        created_at: null,
        updated_at: null
      },
      defaultItem: {
        name: null,
        email: null,
        uid: null,
        photo: null,
        phone: null,
        website: null,
        company: null,
        nid_one: null,
        nid_two: null,
        street: null,
        dob: null,
        about: null,
        role: null,
        email_verified_at: null,
        district: null,
        sub_district: null,
        last_activity: null,
        active: null,
        status: null,
        created_at: null,
        updated_at: null
      },
      paginationMetadata: {
        count: 10,
        current_page: 1,
        last_page: 1,
        next_page: 1,
        next_page_url: null,
        per_page: 10,
        prev_page: 0,
        prev_page_url: null,
        total: 10,
        total_page: 1,
      },
    }
  },
  computed: {
    headers() {
      return [
        {text: this.$t('User ID'), value: 'uid', class: 'accentlight',},
        {
          text: this.$t('Name'),
          sortable: true,
          value: 'name',
          class: 'accentlight text-capitalized',
          sortIcon: 'mdi-menu-up',
          align: 'center'
        },
        {
          text: this.$t('Email'),
          sortable: true,
          value: 'email',
          class: 'accentlight text-capitalized',
          sortIcon: 'mdi-menu-up',
          align: 'center'
        },
        {
          text: this.$t('Mobile'),
          value: 'phone',
          class: 'accentlight',
        },
        {text: this.$t('Wallet Point'), value: 'wallet.available', class: 'accentlight',},
        {text: this.$t('Status'), value: 'status', class: 'accentlight',},
        {text: this.$t('Action'), value: 'action', class: 'accentlight',},
      ]
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Add New' : 'Edit'
    },

  },
  created() {
    this.initialize(this.filterMode)
  },
  methods: {
    initialize() {
      this.loading = true
      this.$axios.get('users')
        .then((res) => {
          this.items = res.data.data.users
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
    closeDeleteDialog() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialogDelete = false
    },
    makeDelete(){
      this.btnLoading = true
      this.$axios.delete('users/'+ this.editedItem.id)
        .then((response) => {
          this.$toast.success(response.data.message)
          this.items.splice(this.editedIndex, 1)
          this.closeDeleteDialog()
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    openDialog(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    closeDialog() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialog = false
    },

    updateStatus() {
      this.stateLoading = true

      let formData = new FormData()
      formData.append('status', this.selectedStatus)
      formData.append('_method', 'put')

      this.$axios.post(`users/${this.editedItem.id}`,  formData)
        .then((res) => {
          this.$toast.success(res.data.message)
          this.initialize()
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message)
        })
        .finally(() => {
          this.stateLoading = false
        })
    },
    openWalletDialog (item) {
      this.editedItem = Object.assign({}, item)
      this.walletDialog = true
    },
    closeWalletDialog() {
      this.walletPoint = 0
      this.editedItem = this.defaultItem
      this.walletDialog = false
    },

    openCreateUserDialog() {
      this.createUserDialog = true
    },
    setWalletPoint() {
      this.btnLoading = true
      let formData  = new FormData()
      formData.append('point', this.walletPoint)
      this.$axios.post(`add-point/${this.editedItem.id}`, formData)
        .then((res) => {
          this.$toast.success(res.data.message)
          this.initialize()
          this.closeWalletDialog()
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
        .finally(() => {
          this.walletDialog = false
          this.btnLoading = false
        })
    },
    updateUser() {},
    saveUser() {
      this.loadingSaveData = true
      this.$axios.post('users', this.formDataItem)
        .then((response) => {
          this.items.push(response.data.data)
          this.$toast.success(response.data.message)
          this.closeView()
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
        .finally(() => {
          this.loadingSaveData = false
        })

    },
    closeView() {
      this.createUserDialog = false
      this.formDataItem = this.defaultFormDataItem
    },
  }
}
</script>

<style scoped>

</style>
