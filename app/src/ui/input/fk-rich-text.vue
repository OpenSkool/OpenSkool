<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/vue-3';

const props = defineProps<{
	context: FormKitFrameworkContext;
}>();

const editor = useEditor({
	content: props.context._value as string,
	extensions: [StarterKit],
	onUpdate() {
		if (editor.value) {
			props.context.node.input(editor.value.getHTML());
		}
	},
});

// watch(
//   () => props.modelValue,
//   (value) => {
//     const isSame = editor.value?.getHTML() === value;
//     if (isSame) {
//       return;
//     }
//     editor.value?.commands.setContent(value, false);
//   },
// );

function buttonClass(
	name: string,
	attributes?: object,
): Record<string, boolean> {
	const isActive =
		(editor.value as typeof editor.value | undefined)?.isActive(
			name,
			attributes,
		) ?? false;
	return { 'bg-primary-100': isActive };
}
</script>

<template>
	<ul class="flex gap-3">
		<li class="flex" role="toolbar">
			<UiIconButton
				:class="buttonClass('bold')"
				label="Toggle Bold Text"
				@click="editor?.chain().focus().toggleBold().run()"
			>
				<RiBold />
			</UiIconButton>
			<UiIconButton
				:class="buttonClass('italic')"
				label="Toggle Italic Text"
				@click="editor?.chain().focus().toggleItalic().run()"
			>
				<RiItalic />
			</UiIconButton>
			<UiIconButton
				:class="buttonClass('strike')"
				label="Toggle Strike Text"
				@click="editor?.chain().focus().toggleStrike().run()"
			>
				<RiStrikethrough />
			</UiIconButton>
		</li>
		<li class="flex" role="toolbar">
			<UiIconButton
				:class="buttonClass('bulletList')"
				label="Toggle Bullet List"
				@click="editor?.chain().focus().toggleBulletList().run()"
			>
				<RiListUnordered />
			</UiIconButton>
			<UiIconButton
				:class="buttonClass('orderedList')"
				label="Toggle Ordered List"
				@click="editor?.chain().focus().toggleOrderedList().run()"
			>
				<RiListOrdered />
			</UiIconButton>
		</li>
		<li class="flex" role="toolbar">
			<UiIconButton
				:class="buttonClass('heading', { level: 1 })"
				label="Toggle Heading 1"
				@click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
			>
				<RiH1 />
			</UiIconButton>
			<UiIconButton
				:class="buttonClass('heading', { level: 2 })"
				label="Toggle Heading 2"
				@click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
			>
				<RiH2 />
			</UiIconButton>
			<UiIconButton
				:class="buttonClass('heading', { level: 3 })"
				label="Toggle Heading 3"
				@click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
			>
				<RiH3 />
			</UiIconButton>
		</li>
		<li class="flex" role="toolbar">
			<UiIconButton
				:class="buttonClass('blockquote')"
				label="Toggle Blockquote"
				@click="editor?.chain().focus().toggleBlockquote().run()"
			>
				<RiDoubleQuotesR />
			</UiIconButton>
			<UiIconButton
				:class="buttonClass('codeBlock')"
				label="Toggle Code Block"
				@click="editor?.chain().focus().toggleCodeBlock().run()"
			>
				<RiCodeBoxLine />
			</UiIconButton>
		</li>
	</ul>
	<UiInput>
		<EditorContent class="rich-text" :editor="editor" v-bind="context.attrs" />
	</UiInput>
</template>

<style>
.ProseMirror {
	min-height: 10em;
	outline: none !important;
}
.rich-text {
	blockquote {
		@apply border-l-gray-300 border-l-5 pl-5 text-gray-800;
	}
	em {
		@apply italic;
	}
	h1 {
		@apply font-bold text-2xl;
	}
	h2 {
		@apply font-bold text-xl;
	}
	h3 {
		@apply font-bold text-lg;
	}
	li {
		@apply pl-3;
	}
	ol {
		@apply list-decimal ml-6;
	}
	p {
		@apply my-3;
	}
	pre {
		@apply rounded-md bg-gray-100 my-3 py-1 px-2 whitespace-pre;
	}
	s {
		@apply line-through;
	}
	strong {
		@apply font-bold;
	}
	ul {
		@apply list-disc ml-6;
	}
}
</style>
