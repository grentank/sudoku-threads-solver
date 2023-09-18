export default function argvGetter(): number | null {
  const [, , arg] = process.argv;
  if (!arg) return null;
  const parsed = parseInt(arg, 10);
  if (Number.isNaN(parsed)) return null;
  return parsed;
}
