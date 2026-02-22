import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

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
      <CardContent className="grid p-4 gap-2">
        <div className="flex justify-between items-start">
          <Label className="font-bold text-lg">{addressInfo?.fullName}</Label>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
            addressInfo?.addressType === 'recipient' 
              ? 'bg-purple-100 text-purple-600' 
              : 'bg-blue-100 text-blue-600'
          }`}>
            {addressInfo?.addressType || 'personal'}
          </span>
        </div>
        <div className="text-sm text-slate-500 space-y-1">
          <p>Email: {addressInfo?.email}</p>
          <p>Address: {addressInfo?.address}</p>
          <p>Location: {addressInfo?.city}</p>
          <p className="tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">Phone: {addressInfo?.phone}</p>
          {cleanNotes && <p className="italic text-xs mt-2 border-t pt-1 text-slate-400">Notes: {cleanNotes}</p>}
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
