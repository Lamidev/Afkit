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
        <Label className="font-bold text-lg">{addressInfo?.fullName}</Label>
        <div className="text-sm text-slate-500 space-y-1">
          <p>Email: {addressInfo?.email}</p>
          <p>Address: {addressInfo?.address}</p>
          <p>Location: {addressInfo?.city}</p>
          <p>Phone: {addressInfo?.phone}</p>
          {cleanNotes && <p className="italic text-xs mt-2 border-t pt-1 text-slate-400">Notes: {cleanNotes}</p>}
        </div>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
