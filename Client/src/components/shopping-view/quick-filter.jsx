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
    <div className="flex flex-col gap-6 py-2 px-1">
      {/* Subcategories Wrapped Grid */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
        <button
          onClick={() => {
            const newParams = new URLSearchParams(searchParams);
            ["brand", "laptopType", "monitorType", "accessoryCategory"].forEach(p => newParams.delete(p));
            newParams.delete("page");
            setSearchParams(newParams);
          }}
          className={`whitespace-nowrap text-[11px] font-black uppercase tracking-[0.12em] transition-all relative py-1 ${
            !["brand", "laptopType", "monitorType", "accessoryCategory"].some(p => searchParams.has(p))
              ? "text-blue-900"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          All Items
          {!["brand", "laptopType", "monitorType", "accessoryCategory"].some(p => searchParams.has(p)) && (
            <motion.div
              layoutId="activeSub"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-900 rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        {subOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleFilterClick(paramKey, opt.id)}
            className={`whitespace-nowrap text-[11px] font-black uppercase tracking-[0.12em] transition-all relative py-1 ${
              isActive(paramKey, opt.id)
                ? "text-orange-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {opt.label}
            {isActive(paramKey, opt.id) && (
              <motion.div
                layoutId="activeSub"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-600 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Price Ranges Wrapped Grid */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 items-center border-t border-slate-100 pt-4">
        <span className="text-[10px] font-black text-slate-300 uppercase shrink-0 tracking-[0.2em]">Budget:</span>
        {filterOptions.priceRangeOptions?.map((range) => (
          <button
            key={range.id}
            onClick={() => handlePriceClick(range)}
            className={`whitespace-nowrap text-[11px] font-black uppercase tracking-[0.12em] transition-all relative py-1 ${
              isPriceActive(range)
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {range.label}
            {isPriceActive(range) && (
              <motion.div
                layoutId="activePrice"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilter;
