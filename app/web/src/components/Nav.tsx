import { useLocation } from "@solidjs/router";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIcon,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuLabel,
	NavigationMenuTrigger
} from "~/components/ui/navigation-menu"
import Container from "./Container";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { useColorMode } from "@kobalte/core";
import { Button } from "./ui/button";
import { Flex } from "./ui/flex";

export default function Nav() {
	const location = useLocation();
	const active = (path: string) => path == location.pathname ? 'font-bold' : undefined;

	const { setColorMode } = useColorMode();

	return (
		<div class="border-b">
			<Container class="flex flex-row justify-between py-1">
				{/* Left */}
				<NavigationMenu>
					<NavigationMenuTrigger as="a" href="/">
						<img src="/images/logo.png" class="rendering-pixelated h-[16px] max-w-min w-min" />
					</NavigationMenuTrigger>
					<NavigationMenuTrigger as="a" href="/" class={active('/')}>
						Home
					</NavigationMenuTrigger>
					<NavigationMenuTrigger as="a" href="/trending" class={active('/trending')}>
						Trending
					</NavigationMenuTrigger>
					<NavigationMenuTrigger as="a" href="/fyp" class={active('/fyp')}>
						For You
					</NavigationMenuTrigger>
				</NavigationMenu>

				{/* Right */}
				<div class="flex flex-row">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="ghost">
								Settings
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									Appearance
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuItem onSelect={() => setColorMode('system')}>
											System
										</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => setColorMode('light')}>
											Light
										</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => setColorMode('dark')}>
											Dark
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button as="a" href="/login" variant="secondary">
						Sign in
					</Button>
				</div>
				
			</Container>
		</div>
	);
}
