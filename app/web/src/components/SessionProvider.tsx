import { Accessor, JSX, Setter, createContext, createSignal, useContext } from "solid-js";
import { useWaiter } from "./WaiterProvider";
import { APIUser } from "waiter";

const SessionContext = createContext<[Accessor<any>, unknown]>();

export function SessionProvider({ children } : { children: JSX.Element }) {
	const waiter = useWaiter();

	const [ session, setSession ] = createSignal<APIUser | null>();
	const functions = {
		async refresh() {
			setSession((await waiter.user({ id: '@me' }).get()).data);
		}
	};

	functions.refresh();

	return (
		<SessionContext.Provider value={[session, functions]}>
			{children}
		</SessionContext.Provider>
	);	
}

export function useSession() {
	const c = useContext(SessionContext);
	return c;
};