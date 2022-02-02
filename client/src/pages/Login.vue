<template>
  <section class="login-container">
    <h1>Redmine kanban board</h1>
    <p class="info">Fill in API key for login. API key is available at the link below: <button class="as-link" @click="getAPILink">API key</button></p>
    <h4>Log in with API key</h4>
    <form @submit.prevent="getUser" class="form-control">
      <div class="omrs-input-group">
        <label class="omrs-input-underlined">
          <input v-model="apiKey" id="api-token" name="api-token" type="text">
          <span class="omrs-input-label">API key</span>
        </label>
      </div>
      <h4>Log in with username and password</h4>
      <div class="omrs-input-group">
        <label class="omrs-input-underlined">
        <input v-model="username" id="username" name="username" type="text">
        <span class="omrs-input-label">Username</span>
        </label>
      </div>
      <div class="omrs-input-group">
        <label class="omrs-input-underlined">
        <input v-model="password" id="password" name="password" type="password" autocomplete="on">
        <span class="omrs-input-label">Password</span>
        </label>
      </div>
      <button class="action">LOG IN</button>
    </form>
  </section>
  <div v-bind:class="{ active: isActive }" class="toast" id="errorToast">Sikertelen bejelentkezés</div>
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
      apiKey
    }
  }
}
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  padding: 24px;
}

.form-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
}

img {
  object-fit: cover;
  width: 100%;
  max-height: 100%;
}

h1 {
  margin-bottom: 0px;
  font-size: 30px;
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
  width: 328px;
  height: 40px;
  background: #005457;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
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


:root {
	--omrs-color-ink-lowest-contrast: rgba(47, 60, 85, 0.18);
	--omrs-color-ink-low-contrast: rgba(60, 60, 67, 0.3);
	--omrs-color-ink-medium-contrast: rgba(19, 19, 21, 0.6);
	--omrs-color-interaction: #000000;
	--omrs-color-interaction-minus-two: rgba(98, 224, 73, 0.12);
	--omrs-color-danger: #b50706;
	--omrs-color-bg-low-contrast: #eff1f2;
	--omrs-color-ink-high-contrast: #121212;
	--omrs-color-bg-high-contrast: #ffffff;
	
}
/** END: Non Openmrs CSS **/
div.omrs-input-group {
  margin-bottom: 1.5rem;
  position: relative;
  width: 20.4375rem;
}

.omrs-input-underlined > input,
.omrs-input-filled > input {
	border: none;
	border-bottom: 0.125rem solid var(--omrs-color-ink-medium-contrast);
	width: 100%;
	height: 3rem;
	font-size: 1.0625rem;
	padding-left: 0rem;
	line-height: 147.6%;
	padding-top: 0.825rem;
	padding-bottom: 0.5rem;
}

.omrs-input-underlined > input:focus,
.omrs-input-filled > input:focus {
	outline: none;
}

.omrs-input-underlined > .omrs-input-label,
.omrs-input-filled > .omrs-input-label {
	position: absolute;
	top: 0.9375rem;
	left: 0rem;
	line-height: 147.6%;
	color: var(--omrs-color-ink-medium-contrast);
	transition: top .2s;
}

.omrs-input-underlined > svg,
.omrs-input-filled > svg {
	position: absolute;
	top: 0.9375rem;
	right: 0.875rem;
	fill: var(--omrs-color-ink-medium-contrast);
}

.omrs-input-underlined > input:hover,
.omrs-input-filled > input:hover {
	background: var(--omrs-color-interaction-minus-two);
	border-color: var(--omrs-color-ink-high-contrast);
}

.omrs-input-underlined > input:focus + .omrs-input-label,
.omrs-input-underlined > input:valid + .omrs-input-label,
.omrs-input-filled > input:focus + .omrs-input-label,
.omrs-input-filled > input:valid + .omrs-input-label {
	top: 0;
	font-size: 0.9375rem;
	margin-bottom: 32px;;
}

.omrs-input-underlined:not(.omrs-input-danger) > input:focus + .omrs-input-label,
.omrs-input-filled:not(.omrs-input-danger) > input:focus + .omrs-input-label {
	color: var(--omrs-color-interaction);
}

.omrs-input-underlined:not(.omrs-input-danger) > input:focus,
.omrs-input-filled:not(.omrs-input-danger) > input:focus {
	border-color: var(--omrs-color-interaction);
}

.omrs-input-underlined:not(.omrs-input-danger) > input:focus ~ svg,
.omrs-input-filled:not(.omrs-input-danger) > input:focus ~ svg {
	fill: var(--omrs-color-ink-high-contrast);
}
</style>
