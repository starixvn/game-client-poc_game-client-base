export function numberWithCommas(value: number) {
  if (value) {
    const result = value.toFixed(2).toString().split(".");

    result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return result[1] !== "00" ? result.join(".") : result[0];
  }

  return "";
}
