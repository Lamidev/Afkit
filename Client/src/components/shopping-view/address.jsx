import { useEffect, useRef, useState } from "react";
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
import { Button } from "../ui/button";
import { Truck, MapPin, Check, Info } from "lucide-react";
import { getRouteFromRegion, REGION_MAPPING, getDeliveryPolicy } from "@/utils/common";


const initialAddressFormData = {
  fullName: "",
  email: "",
  address: "",
  region: "",
  phone: "",
  backupPhone: "",
  notes: "",
  addressType: "personal",
  deliveryPreference: "hub", // default to free pickup
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

  const [formData, setFormData] = useState({
    ...initialAddressFormData,
    addressType: filterType || "personal",
  });
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const userId = user?.id;

  // Filter addresses to only those matching the intent
  const filteredAddressList = filterType
    ? addressList.filter((item) => item.addressType === filterType)
    : addressList;

  // Enhance form controls with validation and simplified logic
  const formControls = addressFormControls
    .filter((control) => {
      // In checkout, we already filter by filterType in the outer tabs
      // But if we want the form to be smart (e.g. in My Account), we show addressType
      if (filterType && control.name === "addressType") return false;
      
      // Email only shows for recipient/gift
      if (control.name === "email") {
         const type = filterType || formData.addressType;
         return type === "recipient";
      }
      
      if (control.name === "city") return false;
      return true;
    })
    .reduce((acc, control) => {
      const currentAddressType = filterType || formData.addressType;
      const compulsoryFields = ["fullName", "phone", "address", "region"];
      if (currentAddressType === "recipient") compulsoryFields.push("email");
      
      const enhancedControl = {
        ...control,
        label: (control.name === "fullName" && currentAddressType === "recipient") ? "Recipient Name" : control.label,
        required: compulsoryFields.includes(control.name),
        fullWidth: ["fullName", "address", "notes"].includes(control.name),
      };

      acc.push(enhancedControl);

      // ── 1. AFTER STATE: Category Choice (if not filtered) ──
      if (control.name === "region" && !filterType) {
         acc.push({
           label: "Who is this for?",
           name: "addressType",
           componentType: "select",
           fullWidth: true,
           options: [
             { id: "personal", label: "📦 Personal (For Me)" },
             { id: "recipient", label: "🎁 Recipient (Someone Else / Gift)" },
           ]
         });
      }

      // ── 2. AFTER STATE: Simplified Delivery Choice ──
      if (control.name === "region") {
        acc.push({
          name: "deliveryChoice",
          componentType: "custom",
          fullWidth: true,
          visibleIf: { field: "region", value: Object.keys(REGION_MAPPING || {}) },
          render: () => {
            return (
              <div className="space-y-3 mt-1 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-1.5 px-1 py-1">
                   <Info className="w-3 h-3 text-primary" />
                   <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Choose Your Delivery Method</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                   {/* Option A: Pickup (Always Free) */}
                   <button
                     type="button"
                     onClick={() => setFormData(prev => ({ ...prev, deliveryPreference: 'hub' }))}
                     className={`flex flex-col p-3 rounded-xl border-2 text-left transition-all ${
                        formData.deliveryPreference === 'hub' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                     }`}
                   >
                     <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-black uppercase text-slate-900">
                          {formData.region === 'Lagos' ? 'Free Home Delivery' : 
                           REGION_MAPPING[formData.region] === 'park' ? 'Free Park Pickup' : 'Free Airport Station'}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.deliveryPreference === 'hub' ? 'bg-primary border-primary' : 'border-slate-300'}`}>
                           {formData.deliveryPreference === 'hub' && <Check className="w-3 h-3 text-white" />}
                        </div>
                     </div>
                     <p className="text-[10px] font-medium text-slate-500 leading-snug">
                       {formData.region === 'Lagos' ? 'We bring it to your door for free.' : 
                        REGION_MAPPING[formData.region] === 'park' ? 'Collect it at the nearest main motor park for FREE.' : 'Collect it at the nearest airport station for FREE.'}
                     </p>
                   </button>

                   {/* Option B: Doorstep (Paid to Rider) - Hide for Lagos as Lagos is already doorstep */}
                   {formData.region !== 'Lagos' && (
                     <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, deliveryPreference: 'doorstep' }))}
                          className={`flex flex-col p-3 rounded-xl border-2 text-left transition-all ${
                             formData.deliveryPreference === 'doorstep' 
                             ? 'border-orange-500 bg-orange-50' 
                             : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                             <span className="text-[11px] font-black uppercase text-slate-900">Bring it to my House</span>
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.deliveryPreference === 'doorstep' ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                                {formData.deliveryPreference === 'doorstep' && <Check className="w-3 h-3 text-white" />}
                             </div>
                          </div>
                          <p className="text-[10px] font-medium text-slate-500 leading-snug">
                            We send it to the nearest station, then a local rider brings it to you. <strong>You will pay the rider for the local trip.</strong>
                          </p>
                        </button>
                      </div>
                   )}
                </div>
              </div>
            );
          }
        });
      }
      return acc;
    }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllAddresses(userId));
    }
  }, [dispatch, userId]);

  const checkoutInitDone = useRef(false);
  const prevRegionRef = useRef("");

  useEffect(() => {
    // Show form immediately if no addresses and filterType is set (checkout first-time)
    if (filterType && filteredAddressList.length === 0 && !showForm) {
      setShowForm(true);
    }
    // Non-checkout: collapse list after save
    if (!filterType && !isCheckoutPage && filteredAddressList.length > 0 && showForm && currentEditedId === null) {
      setShowForm(false);
    }
  }, [filteredAddressList.length, filterType, isCheckoutPage]); // eslint-disable-line

  // Checkout only: once on mount (or when filterType changes), if an address exists pre-load it for editing
  useEffect(() => {
    if (!isCheckoutPage) return;
    checkoutInitDone.current = false;
  }, [filterType]);

  useEffect(() => {
    if (!isCheckoutPage || checkoutInitDone.current) return;
    if (filteredAddressList.length > 0) {
      checkoutInitDone.current = true;
      const addr = filteredAddressList[0];
      setCurrentEditedId(addr._id);
      setFormData({
        fullName: addr.fullName || "",
        email: addr.email || "",
        address: addr.address || "",
        region: addr.region || "",
        phone: addr.phone || "",
        backupPhone: addr.backupPhone || "",
        notes: addr.notes || "",
        addressType: addr.addressType || filterType || "personal",
        deliveryPreference: addr.deliveryPreference || "hub",
        doorstepAgreement: addr.deliveryPreference === 'doorstep',
      });
      setShowForm(true);
    }
  }, [isCheckoutPage, filteredAddressList, filterType]); // eslint-disable-line

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: filterType === "personal" ? (user?.email || "") : (currentEditedId ? prev.email : ""),
      addressType: filterType || prev.addressType,
    }));
  }, [filterType, user?.email, currentEditedId]);

  // Reset delivery preference if region changes
  // Reset delivery preference ONLY when the user genuinely changes the region
  useEffect(() => {
    const prevRegion = prevRegionRef.current;
    if (prevRegion && prevRegion !== formData.region) {
      setFormData(prev => ({
        ...prev,
        deliveryPreference: 'hub',
        doorstepAgreement: false
      }));
    }
    prevRegionRef.current = formData.region;
  }, [formData.region]);

  // Auto-select first matching address
  useEffect(() => {
    if (filteredAddressList.length > 0 && typeof setCurrentSelectedAddress === "function") {
      const alreadySelected = filteredAddressList.find(
        (a) => a._id === selectedId?._id
      );
      if (!alreadySelected) {
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

    // --- Validation Logic ---
    const required = ["fullName", "phone", "address", "region"];
    const type = filterType || formData.addressType;
    if (type === "recipient") required.push("email");

    const missingField = required.find(f => !formData[f]?.trim());
    if (missingField) {
      const label = missingField === "fullName" ? "Name" : missingField;
      toast.error(`Please fill in the ${label} field.`);
      return;
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      toast.error("Main phone number must be at least 10 digits.");
      return;
    }

    if (formData.backupPhone && formData.backupPhone.trim() !== "") {
      const backupDigits = formData.backupPhone.replace(/\D/g, "");
      if (backupDigits.length < 10) {
        toast.error("Backup phone number must be at least 10 digits.");
        return;
      }
    }

    if (!userId) return;

    const resolvedType = filterType || formData.addressType;
    const logisticsRoute = getRouteFromRegion(formData.region);
    const payload = {
      ...formData,
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
            dispatch(fetchAllAddresses(userId)).then(() => {
               // After editing, auto-select this address to refresh the checkout summary
               if (typeof setCurrentSelectedAddress === "function") {
                 setCurrentSelectedAddress({ ...payload, _id: currentEditedId });
               }
            });
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
    checkoutInitDone.current = true; // prevent re-init on re-render
    setCurrentEditedId(addr?._id);
    setFormData({
      fullName: addr?.fullName || "",
      email: addr?.email || "",
      address: addr?.address || "",
      region: addr?.region || "",
      phone: addr?.phone || "",
      backupPhone: addr?.backupPhone || "",
      notes: addr?.notes || "",
      addressType: addr?.addressType || filterType || "personal",
      deliveryPreference: addr?.deliveryPreference || "hub",
      doorstepAgreement: addr?.deliveryPreference === 'doorstep',
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
    const type = filterType || formData.addressType;
    if (type === "recipient") required.push("email");
    return required.every((f) => formData[f]?.trim()?.length > 0);
  }

  const formTitle = currentEditedId ? "Edit Details" : (filterType || formData.addressType) === "recipient" ? "Recipient Details" : "Delivery Details";
  const btnLabel = isSaving ? "Saving..." : currentEditedId ? "Save Changes" : "Save & Continue →";

  return (
    <div className="flex flex-col gap-5">
      {/* ── 1. Header ── */}
      {!hideHeader && !showForm && (
        <div className="flex items-center justify-between px-1">
           <h3 className="font-bold text-slate-900 uppercase text-xs tracking-tight">{formTitle}</h3>
           {filteredAddressList.length < 1 && (
             <Button
               variant="outline"
               size="sm"
               onClick={() => {
                 setCurrentEditedId(null);
                 setFormData({ ...initialAddressFormData, addressType: filterType || "personal" });
                 setShowForm(true);
                 window.scrollTo({ top: 0, behavior: "smooth" });
               }}
               className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all text-[9px] uppercase font-bold px-4 h-7"
             >
               + New {filterType === "recipient" ? "Recipient" : "Address"}
             </Button>
           )}
        </div>
      )}

      {/* ── 2. List (Hide while form is open or in checkout with existing address) ── */}
      {!showForm && !isCheckoutPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredAddressList.map((addr) => (
            <AddressCard
              key={addr._id}
              selectedId={selectedId}
              isCheckoutPage={isCheckoutPage}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={addr}
              handleEditAddress={(a) => {
                handleEditAddress(a);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))}
          {filteredAddressList.length === 0 && (
            <div className="col-span-full text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No matching addresses</p>
               <Button variant="link" onClick={() => setShowForm(true)} className="text-primary font-bold text-[10px] uppercase">
                 Add One &rarr;
               </Button>
            </div>
          )}
        </div>
      )}

      {/* ── 3. Form ── */}
      {showForm && (
        <Card className="border-0 bg-transparent shadow-none animate-in slide-in-from-top duration-300">
          <CardHeader className="p-0 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest leading-none">
                  Fill in where the gadget should be sent
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setCurrentEditedId(null);
                  setFormData({ ...initialAddressFormData, addressType: filterType || "personal" });
                }}
                className="text-slate-400 hover:text-red-500 text-[10px] font-bold uppercase h-6"
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
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
