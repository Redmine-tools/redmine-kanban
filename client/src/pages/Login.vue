<template>
  <section class="login-container">
    <div class="img-container">
      <img class="company-logo" src="@/assets/logo.svg" alt="company-logo">
    </div>
    <h1>{{ $t("header") }}</h1>
    <form @submit.prevent="getUser" class="form-control">
      <div class="input-container">
        <q-input outlined label="Username" v-model="username" id="username" name="username" type="text"/>
        <q-input outlined label="Password" v-model="password" id="password" name="password" :type="isPwd ? 'password' : 'text'" autocomplete="on">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <p class="separator">{{ $t("apiKeyOption") }}</p>
        <p class="info">{{ $t("apiKeyHelp") }} <button class="as-link" @click="getAPILink">{{ $t("apiKey") }}</button></p>
        <q-input outlined label="api key" v-model="apiKey" id="api-token" name="api-token" :type="isApiKey ? 'password' : 'text'">
          <template v-slot:append>
            <q-icon
              :name="isApiKey ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isApiKey = !isApiKey"
            />
          </template>
        </q-input>
        <q-btn type="submit" class="action">{{ $t("login") }}</q-btn>
      </div>
    </form>
    <div v-bind:class="{ active: isActive }" class="toast" id="errorToast">Sikertelen bejelentkezés</div>
  </section>
</template>

<script>
import { ref } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import store from '@/store'
import { useRouter } from 'vue-router'

export default {
  name: "Login",
  setup() {
    const router = useRouter()
    const apiKey = ref('')
    const username = ref('')
    const password = ref('')
    let user = ref('')
    let isActive = ref(false)
    let isPwd = ref(true)
    let isApiKey = ref(true)

    async function getUser() {
      try {
        if(username.value && password.value) {
          let response = await RedmineService.getUserByPassword({
            "username": username.value, 
            "password": password.value 
          })
          user.value = response.data
          store.commit({
            type: 'addUser',
            payload: response.data.user
          })
          router.push('/setup')
        } else {
          const response = (await RedmineService.getUser(apiKey.value))
          user.value = response.data
          store.commit({
            type: 'addUser',
            payload: response.data.user
          })
          router.push('/setup')
        }
      } catch (error) {
          isActive.value = true
          setTimeout(() => isActive.value = false, 2000)
          apiKey.value = ""
          username.value = ""
          password.value = ""
      }
    }

    async function getAPILink() {
      const response = await RedmineService.getRedmineUrl()
      const apiKeyUrl = response.data + "/my/account"
      window.open(apiKeyUrl)
    }

    return {
      user,
      isActive,
      getUser,
      username,
      password,
      getAPILink,
      apiKey,
      isPwd,
      isApiKey
    }
  }
}
</script>

<style scoped>
.login-container {
  margin: auto;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  padding: 20px 50px 48px 50px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 960px) {
  .login-container {
    padding: 20px 36px 48px 36px;
  }
}

.img-container {
  width: 100%;
  text-align: right;
  position: relative;

}

.q-input {
  margin-bottom: 12px;
}

.company-logo {
  width: 98px;
  height: 24px;
}

.form-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}

.separator {
  padding: 16px 0px;
  margin: 0px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #393939;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #c1c1c1 ;
}

.separator:not(:empty)::before {
  margin-right: .25em;
}

.separator:not(:empty)::after {
  margin-left: .25em;
}

img {
  object-fit: cover;
  width: 100%;
  max-height: 100%;
}

h1 {
  margin-bottom: 0px;
  font-size: 30px;
  text-align: left;
  font-size: xx-large;
  font-weight: bold;
  line-height: 3rem;
  padding-bottom: 36px;
}

a {
  margin-bottom: 0px;
}

h4 {
  margin-bottom: 6px;
  margin-top: 12px;
  font-size: 22px;
}

input {
  margin-top: 0px;
  margin-bottom: 0px;
}

.action {
  margin-top: 10px;
  margin-bottom: 0px;
  width: 100%;
  height: 48px;
  background: #295365;
  color: #ffffff;
}

.as-link {
  display: contents;
  border: none;
  background: transparent;
  color: darkblue;
  cursor: pointer;
  text-decoration: underline;
}

.toast {
  position: fixed;
  left: calc(-50vw + 50%);
  right: calc(-50vw + 50%);
  margin-left: auto;
  margin-right: auto;
  visibility: hidden;
  min-width: 250px;
  max-width: 300px;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  z-index: 1;
  bottom: 30px;
  font-size: 17px;
  background-color: #e76f51;
}

.active {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
  z-index: 5;
}

div.input-container {
  margin-bottom: 1.5rem;
  width: 100%;
}
</style>
