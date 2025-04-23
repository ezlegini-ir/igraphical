"use client";

const CopyLink = ({ id }: { id: number }) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/?p=${id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div
      onClick={copyToClipboard}
      title="کپی"
      className="border flex gap-4 items-center border-gray-300 border-dashed rounded-lg w-min text-nowrap p-2 px-6 text-sm cursor-pointer"
    >
      <p>{url}</p>
    </div>
  );
};

export default CopyLink;
