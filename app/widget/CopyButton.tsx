'use client';

export default function CopyButton() {
  const handleCopy = () => {
    const code = document.getElementById('embed-code')?.textContent || '';
    navigator.clipboard.writeText(code);
    alert('Copied to clipboard!');
  };

  return (
    <button 
      onClick={handleCopy}
      className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
    >
      Copy
    </button>
  );
}
