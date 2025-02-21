export default function MenuItem({ 
    label, 
    isSelected = false, 
    count,
    onClick 
  }) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors ${
          isSelected ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
        }`}
      >
        <span className="text-[15px]">{label}</span>
        {count && <span className="text-sm text-gray-500">({count})</span>}
      </button>
    )
  }
  
  