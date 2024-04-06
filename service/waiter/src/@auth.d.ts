import '@auth/core';

declare module '@auth/core' {
	interface User {
		email: undefined;
	}
}