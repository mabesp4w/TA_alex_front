/** @format */

const showRupiah = (value: number | string) => {
  const angka = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp. ${angka}`;
};

export default showRupiah;
