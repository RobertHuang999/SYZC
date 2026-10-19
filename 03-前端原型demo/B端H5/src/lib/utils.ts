export function cn(...inputs: (string | number | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(" ")
}
