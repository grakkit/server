import { type } from './library/type';
import { event } from './library/event';
import { reload } from './library/reload';
import { command } from './library/command';
import * as meta from '@grakkit/core';
import * as platform from './library/platform';
export declare const core: typeof meta.core & typeof platform & {
    command: typeof command;
    event: typeof event;
    reload: typeof reload;
    type: typeof type;
};
