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

const initialAddressFormData = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  phone: "",
  notes: "",
  addressType: "personal",
};

function Address({ setCurrentSelectedAddress, selectedId, filterType }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const userId = user?.id;

  // Filter addresses to only those matching the intent
  const filteredAddressList = filterType
    ? addressList.filter((item) => item.addressType === filterType)
    : addressList;

  const formControls = filterType
    ? addressFormControls.filter((c) => c.name !== "addressType")
    : addressFormControls;

  const [formData, setFormData] = useState({
    ...initialAddressFormData,
    addressType: filterType || "personal",
  });
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch addresses on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchAllAddresses(userId));
    }
  }, [dispatch, userId]);

  // If no addresses exist for this type, open form automatically
  useEffect(() => {
    if (filteredAddressList.length === 0 && !showForm) {
      setShowForm(true);
    }
  }, [filteredAddressList.length]); // eslint-disable-line

  // When filterType changes (intent switch), reset form and re-sync addressType
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      addressType: filterType || prev.addressType,
    }));
  }, [filterType]);

  // Auto-select first matching address when the list loads
  useEffect(() => {
    if (filteredAddressList.length > 0 && typeof setCurrentSelectedAddress === "function") {
      const alreadySelected = filteredAddressList.find(
        (a) => a._id === selectedId?._id
      );
      if (!alreadySelected) {
        setCurrentSelectedAddress(filteredAddressList[0]);
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
    const payload = {
      ...formData,
      addressType: resolvedType,
      isLastUsed: resolvedType === "personal",
      isLastUsedRecipient: resolvedType === "recipient",
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
            toast.success("Address updated!");
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
          const msg = filterType
            ? "Details saved!"
            : "Address added!";
          toast.success(msg);
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
      city: addr?.city || "",
      phone: addr?.phone || "",
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
    return ["fullName", "email", "address", "city", "phone"].every((f) => {
      const v = formData[f];
      return v && typeof v === "string" && v.trim().length > 0;
    });
  }

  // Label copy differs between account page and checkout
  const formTitle = currentEditedId
    ? "Edit Address"
    : filterType === "recipient"
    ? "Recipient Details"
    : filterType === "personal"
    ? "Your Delivery Address"
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
      {/* ── Address Cards ── */}
      {filteredAddressList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredAddressList.map((addr) => (
            <AddressCard
              key={addr._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={addr}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))}

          {/* Add another address card — only shown if < 3 saved and form isn't open */}
          {!showForm && addressList.length < 3 && (
            <div
              className="border-dashed border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all flex flex-col items-center justify-center p-6 min-h-[120px] group"
              onClick={() => {
                setCurrentEditedId(null);
                setFormData({ ...initialAddressFormData, addressType: filterType || "personal" });
                setShowForm(true);
              }}
            >
              <Plus className="w-7 h-7 text-blue-300 group-hover:text-blue-600 transition-colors mb-1.5" />
              <p className="font-bold text-blue-400 group-hover:text-blue-600 transition-colors text-sm">
                Add {filterType === "recipient" ? "Recipient" : "Address"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── New / Edit Form ── */}
      {showForm && (
        <Card className="border-2 border-primary/20 shadow-lg overflow-hidden animate-in slide-in-from-top duration-300">
          <CardHeader className="bg-slate-50 border-b p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">
                  {formTitle}
                </h3>
                {filterType && (
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">
                    {filterType === "recipient"
                      ? "Who should we deliver to?"
                      : "Where should we deliver?"}
                  </p>
                )}
              </div>
              {/* Only show Cancel if there are already cards to go back to */}
              {filteredAddressList.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowForm(false);
                    setCurrentEditedId(null);
                    setFormData({ ...initialAddressFormData, addressType: filterType || "personal" });
                  }}
                  className="text-slate-400 hover:text-red-500 text-xs"
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <CommonForm
              formControls={formControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={btnLabel}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid() || isSaving}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Address;
