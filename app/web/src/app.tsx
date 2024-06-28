import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import Container from "~/components/Container";

import "@fontsource/inter";
import "./app.css";

import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from "@kobalte/core";
import { getCookie } from "vinxi/http";
import { isServer } from "solid-js/web";
import { WaiterProvider } from "./components/WaiterProvider";
import { SessionProvider } from "./components/SessionProvider";

function getServerCookies() {
	"use server";

	const colorMode = getCookie("kb-color-mode");
	return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App() {
	const storageManager = cookieStorageManagerSSR(isServer ? getServerCookies() : document.cookie);

	return (
		<Router
			root={props => (
				<>
					<WaiterProvider>
						<SessionProvider>
							<ColorModeScript storageType={storageManager.type} />
							<ColorModeProvider storageManager={storageManager}>
								<Nav />
								<Container class="my-4">
									<Suspense>{props.children}</Suspense>
								</Container>
							</ColorModeProvider>
						</SessionProvider>
					</WaiterProvider>
				</>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
