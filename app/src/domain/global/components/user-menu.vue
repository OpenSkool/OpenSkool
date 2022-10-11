<script lang="ts" setup>
import { useAuthStore, authLogoutUrl } from '~/auth';
import { AuthConnectButton } from '~/domain/global';

const authStore = useAuthStore();

const route = useRoute();
const logoutHref = computed(() => {
	const logoutUrl = new URL(authLogoutUrl);
	logoutUrl.searchParams.set('from', route.path);
	return logoutUrl.toString();
});
</script>

<template>
	<UiMenu v-if="authStore.isLoggedIn">
		<UiMenuButton>
			<button
				class="rounded-full border-2 p-3 aspect-square focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700)"
			>
				<RiUser3Line aria-hidden />
				<div v-t="'global.userMenu.toggleButton'" class="sr-only" />
			</button>
		</UiMenuButton>
		<UiMenuItems>
			<i18n-t
				class="py-3 px-4 text-dark-500"
				keypath="global.userMenu.description"
				tag="div"
			>
				<template #name>
					<strong class="text-primary-800">{{ authStore.name }}</strong>
				</template>
			</i18n-t>
			<UiMenuItem is="a" :href="logoutHref">
				<RiLogoutBoxRLine aria-hidden />
				{{ $t('global.userMenu.logoutButton') }}
			</UiMenuItem>
		</UiMenuItems>
	</UiMenu>
	<AuthConnectButton v-else />
</template>
