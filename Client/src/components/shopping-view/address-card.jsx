import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { MapPin } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  // Helper to strip HTML tags for clean display of old data
  const cleanNotes = addressInfo?.notes ? addressInfo.notes.replace(/<[^>]*>?/gm, '') : "";

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-300 ${
        selectedId?._id === addressInfo?._id
          ? "border-primary border-[2px] shadow-md bg-primary/5"
          : "border-slate-200 hover:border-primary/50"
      }`}
    >
      <CardContent className="grid p-4 sm:p-5 gap-3">
        <div className="flex justify-between items-start mb-1">
          <div className="space-y-1">
            <Label className="font-bold text-base sm:text-lg text-slate-900 uppercase tracking-tight leading-tight">{addressInfo?.fullName}</Label>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest border ${
                addressInfo?.addressType === 'recipient' 
                  ? 'bg-purple-50 text-purple-600 border-purple-100' 
                  : 'bg-primary/10 text-primary border-primary/20'
              }`}>
                {addressInfo?.addressType === 'recipient' ? 'Recipient' : 'Personal'}
              </span>
              {(addressInfo?.isLastUsed || addressInfo?.isLastUsedRecipient) && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                   Recent
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug uppercase">
              {addressInfo?.address}
            </p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 opacity-80">
              <MapPin className="w-3 h-3" /> {addressInfo?.region}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 pt-2 border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-900 font-mono tracking-tighter whitespace-nowrap">📞 {addressInfo?.phone}</span>
              {addressInfo?.backupPhone && (
                <span className="text-[9px] font-bold text-slate-400 font-mono italic">Alt: {addressInfo.backupPhone}</span>
              )}
            </div>
            {addressInfo?.email && (
              <p className="text-[11px] font-medium text-slate-400 truncate lowercase flex items-center gap-1.5">
                ✉️ {addressInfo?.email}
              </p>
            )}
          </div>

          {cleanNotes && (
             <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 mt-1">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Logistics Note</p>
                <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-relaxed whitespace-pre-wrap italic">"{cleanNotes}"</p>
             </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex gap-3 pt-0">
        <Button 
          variant="outline"
          className="flex-1 bg-white border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all font-bold text-[10px] uppercase h-9 rounded-xl"
          onClick={(e) => { e.stopPropagation(); handleEditAddress(addressInfo); }}
        >
          Edit
        </Button>
        <Button 
          variant="ghost"
          className="px-4 font-bold text-[10px] uppercase h-9 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl"
          onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addressInfo); }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
