export default function ModalPopUp({ isLoading, text }) {
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg text-center w-80">
            <p className="mb-4 text-lg font-semibold">{text}</p>
            <div className="h-12 w-12 mx-auto mb-2 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </>
  );
}
