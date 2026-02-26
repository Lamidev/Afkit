import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { MapPin, Truck, Home, Building2, Plane } from "lucide-react";
import { REGION_MAPPING } from "@/utils/common";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
  isCheckoutPage = false
}) {
  const zone = REGION_MAPPING[addressInfo?.region] || "airport";
  const isHome = addressInfo?.deliveryPreference === 'doorstep';
  const isLagos = addressInfo?.region === 'Lagos';

  const getSimpleLabel = () => {
    if (isLagos) return { text: "🏠 Free Home Delivery", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (isHome) return { text: "🏠 Home Delivery (Pay Rider)", color: "text-orange-600 bg-orange-50 border-orange-100" };
    if (zone === 'park') return { text: "🏢 Free Park Pickup", color: "text-blue-600 bg-blue-50 border-blue-100" };
    return { text: "✈️ Free Airport Pickup", color: "text-blue-600 bg-blue-50 border-blue-100" };
  };

  const label = getSimpleLabel();

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
        selectedId?._id === addressInfo?._id
          ? "border-primary border-[2px] shadow-md bg-white"
          : "border-slate-100 hover:border-primary/30 bg-slate-50/30"
      }`}
    >
      {selectedId?._id === addressInfo?._id && (
        <div className="absolute top-0 right-0 p-1 bg-primary rounded-bl-lg">
           <CheckIcon />
        </div>
      )}

      <CardContent className="grid p-4 gap-3">
        <div className="flex flex-col gap-1">
          <Label className="font-black text-sm text-slate-900 uppercase tracking-tight truncate">
            {addressInfo?.fullName}
          </Label>
          
          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
            <span className={`flex items-center gap-1 text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${label.color}`}>
              {label.text}
            </span>
            {addressInfo?.addressType === 'recipient' && (
              <span className="text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest bg-purple-50 text-purple-600 border border-purple-100 italic">
                Gift
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-slate-700 leading-tight uppercase line-clamp-2">
              {addressInfo?.address}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 opacity-80">
               {addressInfo?.region} State
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-slate-100/50">
             <span className="text-[10px] font-bold text-slate-900 font-mono tracking-tighter">📞 {addressInfo?.phone}</span>
             {addressInfo?.email && (
               <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">@{addressInfo?.email.split('@')[0]}</span>
             )}
          </div>
        </div>
      </CardContent>
      {!isCheckoutPage && (
        <CardFooter className="p-4 flex gap-2 pt-0">
          <Button 
            variant="ghost"
            className="flex-1 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all font-black text-[9px] uppercase h-7 rounded-lg"
            onClick={(e) => { e.stopPropagation(); handleEditAddress(addressInfo); }}
          >
            Edit
          </Button>
          <Button 
            variant="ghost"
            className="px-3 font-black text-[9px] uppercase h-7 text-slate-200 hover:text-red-500 rounded-lg hover:bg-red-50"
            onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addressInfo); }}
          >
            Remove
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default AddressCard;
