<template>
    <v-container 
    class="d-flex ga-4 flex-column text-center h-100 justify-center">
        <v-app-bar elevation="0">
            <template #prepend>
                <v-app-bar-nav-icon>
                    <img
                        src="public/images/agendinha_logo.png"
                        class="logo">
                </v-app-bar-nav-icon>
            </template>
            <template #append>
                <v-icon 
                color="blue-dark" class="px-7 py-4 rounded-xl" 
                style="background-color: #D7F2FF;" icon="mdi-human" />
            </template>
        </v-app-bar>
        <h2 class="font-weight-bold">Bem-vindo(a) à Agendinha</h2>
        <p>Organize seus compromissos e acompanhe tudo de forma simples.</p>
        <v-btn to="/registro" @click="activateFirstTime">Começar agora</v-btn>
        <NuxtLink href="/login" class="font-weight-bold mb-6 text-blue-dark" @click="activateFirstTime">
            Já tenho uma conta
        </NuxtLink>
    </v-container>
</template>

<script lang="ts" setup>
const firstTime = useCookie("firsttime");
function activateFirstTime(): void {
    firstTime.value ||= "false";
}
</script>

<style scoped>
.logo {
    max-width: 80px;
    margin-left: 40px;
}
</style>