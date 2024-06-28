import { JSX, createContext, createSignal, useContext } from "solid-js";
import { treaty } from '@elysiajs/eden';
import type { Waiter } from 'waiter';

// TODO: Figure out putting this in .env later lol
const BASE_URL = 'http://192.168.4.103:3000';

const WaiterContext = createContext(treaty<Waiter>(BASE_URL, {
	fetch: {
		credentials: 'include'
	}
}));

export function WaiterProvider({ children } : { children: JSX.Element }) {
	return (
		<WaiterContext.Provider value={WaiterContext.defaultValue}>
			{children}
		</WaiterContext.Provider>
	);
}

export function useWaiter() { return useContext(WaiterContext) };