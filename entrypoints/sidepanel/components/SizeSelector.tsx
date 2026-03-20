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
          className={`shrink-0 px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
            size === selectedSize
              ? 'bg-[#5B7B94] border border-[#5B7B94] text-white'
              : 'border border-[#E8E6E3] bg-white text-[#6B7280] hover:border-[#5B7B94] hover:text-[#5B7B94]'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

export default SizeSelector;
