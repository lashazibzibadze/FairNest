export function formatString(input: string): string {
    return input
        .split(/[-_]/)
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
}
