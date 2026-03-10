import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { filterOptions } from "@/config";

const QuickFilter = ({ categories, subOptions, paramKey, onClearAll }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterClick = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get(key) === value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    // Reset page to 1 when filter changes
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handlePriceClick = (range) => {
    const newParams = new URLSearchParams(searchParams);
    
    const currentMin = newParams.get("minPrice");
    const currentMax = newParams.get("maxPrice");

    if (currentMin === range.min?.toString() && currentMax === range.max?.toString()) {
      newParams.delete("minPrice");
      newParams.delete("maxPrice");
    } else {
      if (range.min !== undefined) newParams.set("minPrice", range.min.toString());
      else newParams.delete("minPrice");
      
      if (range.max !== undefined) newParams.set("maxPrice", range.max.toString());
      else newParams.delete("maxPrice");
    }
    
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const isActive = (key, value) => searchParams.get(key) === value;
  
  const isPriceActive = (range) => {
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    return (range.min === undefined || min === range.min.toString()) &&
           (range.max === undefined || max === range.max.toString()) &&
           (min !== null || max !== null);
  };

  const hasAnyFilter = ["brand", "laptopType", "monitorType", "accessoryCategory", "minPrice", "maxPrice"].some(p => searchParams.has(p));

  return (
    <div className="flex flex-col gap-1.5 py-1.5 px-3 bg-blue-50/50 border border-blue-100/50 rounded-xl shadow-sm">
      {/* Subcategories Wrapped Grid */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <button
          onClick={() => {
            const newParams = new URLSearchParams(searchParams);
            ["brand", "laptopType", "monitorType", "accessoryCategory"].forEach(p => newParams.delete(p));
            newParams.delete("page");
            setSearchParams(newParams);
          }}
          className={`whitespace-nowrap text-[9px] font-black uppercase tracking-tight transition-all px-2.5 py-1 rounded-lg ${
            !["brand", "laptopType", "monitorType", "accessoryCategory"].some(p => searchParams.has(p))
              ? "bg-blue-900 text-white shadow-md"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 shadow-sm"
          }`}
        >
          All Items
        </button>

        {subOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleFilterClick(paramKey, opt.id)}
            className={`whitespace-nowrap text-[9px] font-black uppercase tracking-tight transition-all px-2.5 py-1 rounded-lg ${
              isActive(paramKey, opt.id)
                ? "bg-blue-900 text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 shadow-sm"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Price Ranges Wrapped Grid */}
      <div className="flex flex-wrap gap-1.5 items-center border-t border-slate-100 pt-1.5">
        <span className="text-[9px] font-black text-blue-900 uppercase shrink-0 tracking-tight mr-1">Budget:</span>
        {filterOptions.priceRangeOptions?.map((range) => (
          <button
            key={range.id}
            onClick={() => handlePriceClick(range)}
            className={`whitespace-nowrap text-[9px] font-black uppercase tracking-tight transition-all px-2.5 py-1 rounded-lg ${
              isPriceActive(range)
                ? "bg-blue-900 text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 shadow-sm"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilter;
