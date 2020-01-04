export function toCurrency(amount) {
  return "Rs " + amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
