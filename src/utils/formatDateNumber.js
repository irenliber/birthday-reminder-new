const formatDateNumber = (number) =>
  number.toString().length > 1 ? number : `0${number}`;

export default formatDateNumber;
