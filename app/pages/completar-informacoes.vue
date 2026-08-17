<template>
  <v-container class="position-fixed h-100">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title
          class="font-weight-bold ml-2">Completar Informações</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <v-text-field
        v-model="formUser.nomeResponsavel.value"
        prepend-inner-icon="mdi-account-outline"
        label="Nome do(a) responsável"
        />
        <v-text-field 
        v-model="formUser.idPaciente.value"
        prepend-inner-icon="mdi-card-account-details-outline"
        label="ID do(a) paciente" 
        />
      <v-btn 
        class="w-100 mb-5"
        @click="update"
        >Finalizar</v-btn>
    </v-main>
  </v-container>
</template>

<script lang="ts" setup>
import { useAuthStore } from "~/app/store/auth";
import updateUserInfo from "~/server/api/user/updateUserInfo";
import type UserUpdate from "~/interfaces/userUpdate";
import { useLoaderStore } from "~/app/store/loader";
import confirmAccount from "~/server/api/register/confirmAccount";

const auth = useAuthStore();
const loader = useLoaderStore();
const { user } = storeToRefs(auth);
const toast: any = useNuxtApp().$toast;
const router = useRouter();

const formUser = {
  nomeResponsavel: ref(user.value.nome as string),
  email: user.value.email as string,
  idPaciente: ref(null)
};

async function update() {
  loader.startLoading();
  if(formUser.idPaciente.value == null) {
    toast.error("ID do paciente inválido.");
    loader.endLoading();
    return;
  }

  const data: UserUpdate = {
    nome: formUser.nomeResponsavel.value,
    email: formUser.email,
  };

  const responses = await Promise.all([
    updateUserInfo(data),
    confirmAccount(data.email),
  ]);

  for(const response of responses) {
    if(response.status != 200 && response.status != 204) {
      toast.error("Erro ao atualizar dados.");
      loader.endLoading();
      return;
    }
  }

  router.push("/");
  loader.endLoading();
}

</script>
