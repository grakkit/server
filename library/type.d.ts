import { types } from './overloads';
export declare function type<X extends keyof types>(name: X): types[X];
