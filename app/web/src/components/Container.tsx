import { JSX } from "solid-js";
import { cn } from "~/lib/utils";

export default function Container(props: { children: JSX.Element, class?: string }) {
	return <div class={cn('container', props.class)}>
		{props.children}
	</div>;
}