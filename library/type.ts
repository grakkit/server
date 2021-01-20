//@ts-expect-error
import { core } from '@grakkit/core';
import { types } from './overloads';

export function type<X extends keyof types> (name: X): types[X] {
   return core.type(name);
}
