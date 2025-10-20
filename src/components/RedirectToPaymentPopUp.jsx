
export default function RedirectToPaymentPopUp({ isLoadingPayment, text }) {
  return (
    <>
      {isLoadingPayment && (
        <div className="fixed inset-0 z-50 flex items-center rounded-4xl justify-center bg-black/50 rounded-md">
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl text-center w-80">
            <p className="mb-4 text-md font-semibold">{text}</p>
          </div>
        </div>
      )}
    </>
  );
}
