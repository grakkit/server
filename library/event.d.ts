import { events } from './overloads';
export declare function event<X extends keyof events>(name: X, ...listeners: ((event: events[X]) => void)[]): void;
