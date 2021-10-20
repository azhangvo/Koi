export function escapeMarkdown(str: string) {
    return str.replace(/[_*>|\\]/g, "\\$&");
}

export function escape(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}