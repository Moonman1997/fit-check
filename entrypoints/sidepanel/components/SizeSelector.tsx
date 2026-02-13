interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
}: SizeSelectorProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSizeChange(size)}
          className={`shrink-0 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
            size === selectedSize
              ? 'bg-gray-900 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

export default SizeSelector;
