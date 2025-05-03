/** @format */

export const showModal = (modalId: string) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    modal.showModal();
  }
};

export const closeModal = (modalId: string) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    modal.close();
  }
};
