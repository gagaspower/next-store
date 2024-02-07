export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function containsOnlyNumbers(str: string) {
  return /^([0-9]+-)*([0-9]+)$/.test(str);
}

export const maxWorldToDisplay: number = 7;

export function limitProductTitle(value: string) {
  const words = value.split(/\s+/); // Membagi string menjadi array kata
  const truncatedString =
    words.length > maxWorldToDisplay
      ? `${words.slice(0, maxWorldToDisplay).join(" ")}...`
      : value;

  return truncatedString;
}
