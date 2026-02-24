import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Truck, MapPin, Check } from "lucide-react";
import { getRouteFromRegion, REGION_MAPPING } from "@/utils/common";


const initialAddressFormData = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  region: "",
  phone: "",
  backupPhone: "",
  notes: "",
  addressType: "personal",
};

function Address({ 
  setCurrentSelectedAddress, 
  selectedId, 
  filterType, 
  isCheckoutPage = false,
  hideHeader = false 
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const userId = user?.id;

  // Filter addresses to only those matching the intent
  const filteredAddressList = filterType
    ? addressList.filter((item) => item.addressType === filterType)
    : addressList;

  // Enhance form controls with validation and conditional logic
  const formControls = addressFormControls
    .filter((control) => {
      // 1. Hide addressType if we are on checkout (filterType exists)
      if (filterType && control.name === "addressType") return false;
      // 2. Hide email for personal orders (using account email instead)
      if (filterType === "personal" && control.name === "email") return false;
      // 3. Hide city if it's merged into address
      if (control.name === "city") return false;
      return true;
    })
    .reduce((acc, control) => {
      // Mark compulsory fields
      const compulsoryFields = ["fullName", "phone", "address", "region"];
      if (filterType === "recipient") compulsoryFields.push("email");
      
      const enhancedControl = {
        ...control,
        required: compulsoryFields.includes(control.name),
        fullWidth: ["fullName", "address", "notes"].includes(control.name),
      };

      acc.push(enhancedControl);

      // Inject custom route preview after the 'region' (State) select
      if (control.name === "region") {
        acc.push({
          name: "logisticsPreview",
          componentType: "custom",
          fullWidth: true,
          visibleIf: { field: "region", value: Object.keys(REGION_MAPPING || {}) },
          render: () => (
            <div className="p-3 sm:p-4 rounded-xl border border-blue-100 bg-blue-50/30 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Auto-Assigned Route</span>
                 </div>
                 <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <Check className="w-2 h-2 text-emerald-600" />
                    <span className="text-[7px] font-black text-emerald-600 uppercase">Verified</span>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                    {getRouteFromRegion(formData.region) === 'lagos' ? 'Lagos Doorstep Delivery' : 
                     getRouteFromRegion(formData.region) === 'south-west' ? 'South-West Regional Hub' :
                     getRouteFromRegion(formData.region) === 'north' ? 'Northern/Abuja Hub' : 'Eastern/Southern Hub'}
                 </span>
                 <span className="text-[8px] font-bold text-slate-300 uppercase italic">Free Nationwide</span>
              </div>
            </div>
          )
        });
      }
      return acc;
    }, []);

  const [formData, setFormData] = useState({
    ...initialAddressFormData,
    addressType: filterType || "personal",
  });
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showForm, setShowForm] = useState(false); // always start on card list; useEffect opens form when needed
  const [isSaving, setIsSaving] = useState(false);

  // Fetch addresses on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchAllAddresses(userId));
    }
  }, [dispatch, userId]);

  // Only auto-open the new address form if:
  //  a) We're on checkout (filterType is set), AND
  //  b) There are truly no saved addresses of that type
  useEffect(() => {
    if (filterType && filteredAddressList.length === 0 && !showForm) {
      setShowForm(true);
    }
    // If we're on the account page (no filterType), always default to showing cards
    if (!filterType && filteredAddressList.length > 0 && showForm && currentEditedId === null) {
      setShowForm(false);
    }
  }, [filteredAddressList.length, filterType]); // eslint-disable-line

  // When filterType changes (intent switch), reset form and re-sync addressType
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: filterType === "personal" ? (user?.email || "") : "",
      addressType: filterType || prev.addressType,
    }));
  }, [filterType, user?.email]);

  // Auto-select first matching address when the list loads
  useEffect(() => {
    if (filteredAddressList.length > 0 && typeof setCurrentSelectedAddress === "function") {
      const alreadySelected = filteredAddressList.find(
        (a) => a._id === selectedId?._id
      );
      if (!alreadySelected) {
        // Preference for last-used
        const preference = filteredAddressList.find(a => 
          filterType === 'personal' ? a.isLastUsed : a.isLastUsedRecipient
        ) || filteredAddressList[0];
        
        setCurrentSelectedAddress(preference);
      }
    }
  }, [filteredAddressList]); // eslint-disable-line

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      toast.error("Maximum 3 addresses allowed.");
      return;
    }
    if (!userId) {
      toast.error("Session error. Please log in again.");
      return;
    }

    // Always use the correct type: filterType overrides whatever is in formData
    const resolvedType = filterType || formData.addressType;
    const logisticsRoute = getRouteFromRegion(formData.region);
    const payload = {
      ...formData,
      city: formData.city && !['Included', 'N/A'].includes(formData.city.trim()) ? formData.city.trim() : "",
      logisticsRoute,
      addressType: resolvedType,
      isLastUsed: resolvedType === "personal",
      isLastUsedRecipient: resolvedType === "recipient",
      email: (resolvedType === "personal" && !formData.email) ? user?.email : formData.email
    };

    setIsSaving(true);

    if (currentEditedId !== null) {
      dispatch(editAddress({ userId, addressId: currentEditedId, formData: payload })).then(
        (data) => {
          setIsSaving(false);
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(userId));
            setCurrentEditedId(null);
            setFormData({ ...initialAddressFormData, addressType: resolvedType });
            setShowForm(false);
            toast.success("Details updated!");
          }
        }
      );
    } else {
      dispatch(addNewAddress({ ...payload, userId })).then((data) => {
        setIsSaving(false);
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(userId)).then(() => {
            if (data?.payload?.data && typeof setCurrentSelectedAddress === "function") {
              setCurrentSelectedAddress(data.payload.data);
            }
          });
          setFormData({ ...initialAddressFormData, addressType: resolvedType });
          setShowForm(false);
          toast.success("Details saved!");
        }
      });
    }
  }

  function handleEditAddress(addr) {
    setCurrentEditedId(addr?._id);
    setFormData({
      fullName: addr?.fullName || "",
      email: addr?.email || "",
      address: addr?.address || "",
      city: (addr?.city && !['Included', 'N/A'].includes(addr.city)) ? addr.city : "",
      region: addr?.region || "",
      phone: addr?.phone || "",
      backupPhone: addr?.backupPhone || "",
      notes: addr?.notes || "",
      addressType: addr?.addressType || filterType || "personal",
    });
    setShowForm(true);
  }

  function handleDeleteAddress(addr) {
    dispatch(deleteAddress({ userId, addressId: addr._id })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(userId));
        if (selectedId?._id === addr._id && typeof setCurrentSelectedAddress === "function") {
          setCurrentSelectedAddress(null);
        }
        toast.success("Address removed.");
      }
    });
  }

  function isFormValid() {
    const required = ["fullName", "phone", "address", "region"];
    if (filterType === "recipient") required.push("email");
    
    return required.every((f) => {
      const v = formData[f];
      return v && typeof v === "string" && v?.trim()?.length > 0;
    });
  }

  // Label copy differs between account page and checkout
  const formTitle = currentEditedId
    ? "Edit Details"
    : filterType === "recipient"
    ? "Recipient Details"
    : filterType === "personal"
    ? "Delivery Information"
    : "New Address";

  const btnLabel = isSaving
    ? "Saving..."
    : currentEditedId
    ? "Update Address"
    : filterType
    ? "Save & Continue →"
    : "Save Address";

  return (
    <div className="flex flex-col gap-5">
      {/* ── 1. Header (Only if not hidden) ── */}
      {!hideHeader && !showForm && (
        <div className="flex items-center justify-between px-1">
           <h3 className="font-bold text-slate-900 uppercase text-sm tracking-tight">{formTitle}</h3>
           {filteredAddressList.length < 3 && (
             <Button
               variant="outline"
               size="sm"
               onClick={() => {
                 setCurrentEditedId(null);
                 setFormData({ ...initialAddressFormData, addressType: filterType || "personal" });
                 setShowForm(true);
                 window.scrollTo({ top: 0, behavior: "smooth" });
               }}
               className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all text-[10px] uppercase font-bold px-4"
             >
               + New {filterType === "recipient" ? "Recipient" : "Address"}
             </Button>
           )}
        </div>
      )}

      {/* ── 2. Address Cards List (Hidden when form is open to focus) ── */}
      {!showForm && filteredAddressList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredAddressList.map((addr) => (
            <AddressCard
              key={addr._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={addr}
              handleEditAddress={(a) => {
                handleEditAddress(a);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))}
        </div>
      ) : !showForm && filteredAddressList.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No addresses saved yet</p>
           <Button
               variant="link"
               onClick={() => {
                  setShowForm(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
               }}
               className="text-primary font-bold text-xs uppercase"
            >
              Add your first one &rarr;
            </Button>
        </div>
      ) : null}

      {/* ── 3. New / Edit Form (Full view focus) ── */}
      {showForm && (
        <Card className="border-2 border-primary/20 shadow-lg overflow-hidden animate-in slide-in-from-top duration-300">
          <CardHeader className="bg-slate-50 border-b p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">
                  {currentEditedId ? "Update Details" : "Enter Details"}
                </h3>
                {filterType && (
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">
                    {filterType === "recipient"
                      ? "Shipping details for the receiver"
                      : "Your shipping information"}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setCurrentEditedId(null);
                  setFormData({ ...initialAddressFormData, addressType: filterType || "personal" });
                }}
                className="text-slate-400 hover:text-red-500 text-xs font-bold uppercase"
              >
                {filteredAddressList.length > 0 ? "Cancel" : "Back"}
              </Button>
            </div>
          </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <CommonForm
                formControls={formControls}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleManageAddress}
                buttonText={btnLabel}
                isBtnDisabled={!isFormValid() || isSaving}
              />
            </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Address;
