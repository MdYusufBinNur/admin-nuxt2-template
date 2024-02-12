<template>
  <div align="center" class="justify-center">
    <v-row justify="center" align="center">
      <v-card class="text-center" outlined elevation="3" :width="$vuetify.breakpoint.smAndDown ? '500' : '450'"
      >

        <div>
          <v-row align="center" class="mb-5">
            <v-col class="col-sm-3"></v-col>
            <v-col class="col-sm-6 align-self-center pt-3">
              <!--              <span class="kep_title">G-Crae Admin Panle</span>-->
              <!--              <v-img :src="logo" contain :aspect-ratio="bp.mdAndUp ? 5 : 2" class="mt-4 justify-center"></v-img>-->
            </v-col>
            <v-col class="col-sm-3 align-self-center">
              <!--              <LanguageSelect :auth-layout="true"/>-->
            </v-col>
          </v-row>
        </div>
        <span class="kep_title">
          Log in
        </span>
        <div align="center">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation>
            <v-card align="center" class="text-center" flat :width="$vuetify.breakpoint.smAndDown ? '400' : '500'">
              <v-card-text>

                <v-row class="justify-center">
                  <v-col cols="10">
                    <v-text-field
                      v-model="loginInfo.email"
                      rounded
                      color="secondary"
                      :rules="validationRules.email"
                      outlined
                      :placeholder="'Email'"
                      hide-details="auto"
                      required
                      prepend-inner-icon="mdi-account-outline"
                      type="email"
                    >
                      <template v-slot:prepend-inner>
                        <v-img :src="account" class="mr-2">

                        </v-img>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="10">
                    <v-text-field
                      v-model="loginInfo.password"
                      outlined
                      rounded
                      color="secondary"
                      :rules="validationRules.password"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :placeholder="'Password'"
                      :type="showPassword ? 'text' : 'password'"
                      hide-details="auto"
                      required
                      @click:append="showPassword = !showPassword"
                    >
                      <template v-slot:prepend-inner>
                        <v-img :src="lock" class="mr-2">

                        </v-img>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="10" align="start" class="pa-0 pl-3">
                    <v-list-item class="pa-0">
                      <v-list-item-action>
                        <v-checkbox color="secondary"></v-checkbox>
                      </v-list-item-action>
                      <p style="margin-top: 15px; margin-left: -20px">
                        Keep me signed in
                      </p>
                      <v-spacer/>
                      <v-btn text @click="" small align="right" class="text-capitalize font-italic"
                             color="info">forget password ?
                      </v-btn>
                    </v-list-item>
                  </v-col>
                </v-row>

              </v-card-text>
              <v-card-actions class="text-center">
                <v-row class="justify-center">
                  <v-col cols="10">
                    <v-btn
                      block
                      large
                      rounded
                      class="btn secondary mb-10 text-capitalize"
                      :loading="isLoading"
                      @click="userLogin()"
                    >
                      Log in
                    </v-btn>
                  </v-col>
                </v-row>

              </v-card-actions>
            </v-card>
          </v-form>
        </div>

      </v-card>

    </v-row>
  </div>
</template>
<script>
import logo from 'static/logo.png'
import lock from 'static/lock.png'
import account from 'static/account.png'
import validationMixin from "../../mixins/validationMixin";

export default {
  props: {
    isDialog: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    }
  },
  mixins: [validationMixin],
  data: () => ({
    isLoading: false,
    valid: true,
    logo,
    lock,
    account,
    showPassword: false,
    loginInfo: {
      email: '',
      password: ''
    },
    isLoggedIn: false,
    snackbar: false,
    errorMessage: '',
    errorColor: '',

  }),

  computed: {},


  methods: {
    validate() {
      this.$refs.form.validate()
    },
    async userLogin() {
      this.isLoading = true;
      if (!this.$refs.form.validate()) {
        this.errorMessage = 'Please input valid data'
        this.errorColor = 'error'
        this.snackbar = true
        this.isLoading = false
        return;
      }
      try {
        let response =
          await
            this.$auth
              .loginWith('local', {data: this.loginInfo})
              .then((response) => {
                if (response.data.error === false) {
                  return this.$router.push('/');
                }
              })
              .finally(() => {
                this.isLoading = false
              });
      } catch (err) {
        this.$toast.error(err.response.data.message)
      }
    }
  }
}
</script>

<style scoped>

.btn {
  flex: 1 1 auto;
  margin: 10px;
  padding: 30px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  /* text-shadow: 0px 0px 10px rgba(0,0,0,0.2);*/
  box-shadow: 0 0 20px #eee;
}

/* Demo Stuff End -> */

/* <- Magic Stuff Start */

.btn:hover {
  background-position: right center; /* change the direction of the change here */
}

.btn-3 {
  /*background-image: linear-gradient(to right, #c4ab65 0%, #b49c69 51%, #d9b674 100%);*/
}

</style>
