import { writable } from "svelte/store";


export const manual = writable(false);
export const automation = writable();
export const animationInterval = writable(0.05);