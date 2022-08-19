import type { ApolloError } from '@apollo/client';
import { logErrorMessages } from '@vue/apollo-util';
import { acceptHMRUpdate, defineStore } from 'pinia';

const ERROR_TIMEOUT = 30_000;

export const useGlobalStore = defineStore('global', () => {
  const globalErrorTimeout = ref<number>();
  const hasGlobalError = ref(false);

  function handleApolloError(error: ApolloError): void {
    logErrorMessages(error);
  }

  function setGlobalError(): void {
    clearTimeout(globalErrorTimeout.value);
    hasGlobalError.value = true;
    globalErrorTimeout.value = window.setTimeout(() => {
      hasGlobalError.value = false;
      globalErrorTimeout.value = undefined;
    }, ERROR_TIMEOUT);
  }

  function handleFatalApolloError(error: ApolloError): void {
    handleApolloError(error);
    setGlobalError();
  }

  return {
    hasGlobalError,
    handleApolloError,
    handleFatalApolloError,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot));
}
