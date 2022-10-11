<script lang="ts" setup>
import { useGlobalStore } from '~/domain/global/store';
import { i18nLoaderService } from '~/i18n';

// import DebugLayout from './debug-layout.vue';
import LanguageSelect from './language-select.vue';
import LoadingSpinner from './loading-spinner.vue';
import MainMenuToggleButton from './main-menu/main-menu-toggle-button.vue';
import MainMenu from './main-menu/main-menu.vue';
import { useMenuState } from './main-menu/use-menu-state';
import UserMenu from './user-menu.vue';

await i18nLoaderService.loadGlobalMessages();

const globalStore = useGlobalStore();

const { menuState, toggleMenu } = useMenuState();
</script>

<template>
	<!-- <DebugLayout /> -->
	<div class="grid">
		<div
			class="flex bg-light-100 shadow-sm p-3 shadow-gray-200 col-span-2 relative items-center justify-between"
		>
			<MainMenuToggleButton
				aria-controls="mainMenu"
				:aria-expanded="menuState.opened"
				@click="toggleMenu()"
			/>
			<LoadingSpinner />
			<div class="flex gap-3">
				<LanguageSelect class="hidden md:block" />
				<UserMenu />
			</div>
		</div>
		<MainMenu
			id="mainMenu"
			class="shadow-sm shadow-gray-200"
			:state="menuState"
		/>
		<div
			class="bg-gray-100 mb-10"
			:class="{ 'col-span-2': menuState.overlay || !menuState.opened }"
		>
			<main class="mx-auto p-10 lg:container">
				<UiNotification
					v-if="globalStore.hasGlobalError"
					class="mb-5"
					color="danger"
					role="alert"
					heading="Something went wrong"
				>
					<p v-t="'global.layout.root.globalError'" />
				</UiNotification>
				<Suspense>
					<RouterView />
				</Suspense>
			</main>
		</div>
	</div>
</template>

<style scoped>
.grid {
	grid-template-columns: 30ch 1fr;
}
</style>
