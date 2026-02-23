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
      <CardContent className="grid p-5 gap-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Label className="font-bold text-lg text-slate-900 uppercase tracking-tight">{addressInfo?.fullName}</Label>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest border ${
                addressInfo?.addressType === 'recipient' 
                  ? 'bg-purple-50 text-purple-600 border-purple-100' 
                  : 'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                {addressInfo?.addressType === 'recipient' ? 'Recipient' : 'My Address'}
              </span>
              {(addressInfo?.isLastUsed || addressInfo?.isLastUsedRecipient) && (
                <span className="text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                   Last Used
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Location</p>
            <p className="text-base sm:text-lg font-semibold text-slate-800 leading-tight uppercase">
              {addressInfo?.address}, {addressInfo?.city}
            </p>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 bg-blue-50 w-fit px-3 py-1 rounded-lg">
              <MapPin className="w-3 h-3" /> State: {addressInfo?.region?.replace('-', ' ') || 'Lagos'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact</p>
              <p className="text-xs font-bold text-slate-900 font-mono tracking-tighter">{addressInfo?.phone}</p>
              {addressInfo?.backupPhone && (
                <p className="text-[9px] font-bold text-slate-400 font-mono italic">Alt: {addressInfo.backupPhone}</p>
              )}
            </div>
            {addressInfo?.email && (
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Identity</p>
                <p className="text-xs font-medium text-slate-500 truncate lowercase">{addressInfo?.email}</p>
              </div>
            )}
          </div>

          {cleanNotes && (
             <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Logistics Note</p>
                <p className="text-[11px] font-medium text-slate-600 line-clamp-2 leading-relaxed whitespace-pre-wrap">{cleanNotes}</p>
             </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 flex justify-between gap-2 pt-0">
        <Button 
          variant="outline"
          className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition-all font-bold text-xs h-8"
          onClick={(e) => { e.stopPropagation(); handleEditAddress(addressInfo); }}
        >
          Edit
        </Button>
        <Button 
          variant="destructive"
          className="flex-1 font-bold text-xs h-8"
          onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addressInfo); }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
