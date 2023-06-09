import numeral from "numeral";

export const formatNumber = (number: number, isUSD = false) => {
  if (number) {
    if (Math.abs(number) < 1) {
      if (isUSD) {
        return "$" + numeral(number).format("0,0[.]00");
      } else if (Math.abs(number) < 0.0001) {
        return numeral(number).format("0,0.00e+0");
      } else {
        return numeral(number).format("0,0[.]0000");
      }
    }
    return (isUSD ? "$" : "") + numeral(number).format("0,0[.]00");
  } else if (isUSD) {
    return "$0"
  }
  return "0";
};

export const shortNumberFormat = (number: number) => {
  if (number < 1000) {
    if (number < 1 && number > 0) {
      if (number < 0.001) {
        return numeral(number).format("0.0e-0");
      }
      return numeral(number).format("0.000");
    }
    return numeral(number).format("0[.]00a");
  } else {
    return numeral(number)
      .format("0.0a", (n: number) => {
        return Math.floor(n);
      })
      .toUpperCase();
  }
};

export const percentageFormat = (number: number) => {
  if (number) {
    if (Math.abs(number) < 0.01) {
      return numeral(number).format("0a[.]0000");
    } else {
      return numeral(number).format("0a[.]00");
    }
  }
  return 0;
};
