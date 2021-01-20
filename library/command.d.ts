import { obcCommandSender } from '@grakkit/server-classes';
export declare function command(options: {
    name: string;
    message?: string;
    aliases?: string[];
    execute?: (sender: obcCommandSender, ...args: string[]) => void;
    namespace?: string;
    permission?: string;
    tabComplete?: (sender: obcCommandSender, ...args: string[]) => string[];
}): void;
