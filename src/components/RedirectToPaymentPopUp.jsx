
export default function RedirectToPaymentPopUp({ isLoadingPayment, text }) {
  return (
    <>
      {isLoadingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className="relative bg-white p-6 rounded shadow-lg text-center w-80">
            <p className="mb-4 text-lg font-semibold">{text}{console.log(`is loading payment works: ${isLoadingPayment}`)}</p>
          </div>
        </div>
      )}
    </>
  );
}
