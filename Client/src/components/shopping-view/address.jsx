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
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  // Single source of truth for userId throughout this component
  const userId = user?.id;

  // Fetch addresses when user is available
  useEffect(() => {
    if (userId) {
      dispatch(fetchAllAddresses(userId));
    }
  }, [dispatch, userId]);

  // Auto-select logic
  useEffect(() => {
    if (addressList && addressList.length > 0) {
      if (!selectedId || (addressList.length === 1 && selectedId?._id !== addressList[0]._id)) {
        setCurrentSelectedAddress(addressList[0]);
      }
    }
  }, [addressList, selectedId, setCurrentSelectedAddress]);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.error("Maximum 3 addresses allowed.");
      return;
    }

    if (!userId) {
      toast.error("Session error. Please log out and log back in.");
      return;
    }

    if (currentEditedId !== null) {
      dispatch(
        editAddress({
          userId,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(userId));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          setShowForm(false);
          toast.success("Address updated successfully!");
        }
      });
    } else {
      dispatch(
        addNewAddress({
          ...formData,
          userId,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(userId)).then(() => {
            if (data?.payload?.data) {
              setCurrentSelectedAddress(data?.payload?.data);
            }
          });
          setFormData(initialAddressFormData);
          setShowForm(false);
          toast.success("Address added and selected!");
        }
      });
    }
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      fullName: getCuurentAddress?.fullName || "",
      email: getCuurentAddress?.email || "",
      address: getCuurentAddress?.address || "",
      city: getCuurentAddress?.city || "",
      phone: getCuurentAddress?.phone || "",
      notes: getCuurentAddress?.notes || "",
    });
    setShowForm(true);
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(userId));
        if (selectedId?._id === getCurrentAddress._id) {
          setCurrentSelectedAddress(null);
        }
        toast.success("Address deleted.");
      }
    });
  }

  function isFormValid() {
    const requiredFields = ["fullName", "email", "address", "city", "phone"];
    return requiredFields.every((field) => {
      const value = formData[field];
      return value && typeof value === "string" && value.trim().length > 0;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}

        {!showForm && addressList.length < 3 && (
          <div
            className="border-dashed border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all flex flex-col items-center justify-center p-6 min-h-[150px] group"
            onClick={() => {
              setCurrentEditedId(null);
              setFormData(initialAddressFormData);
              setShowForm(true);
            }}
          >
            <Plus className="w-8 h-8 text-slate-300 group-hover:text-primary transition-colors mb-2" />
            <p className="font-bold text-slate-400 group-hover:text-primary transition-colors">Add New Address</p>
          </div>
        )}
      </div>

      {showForm && (
        <Card className="border-2 border-primary/20 shadow-xl shadow-primary/5 overflow-hidden animate-in slide-in-from-top duration-300">
          <CardHeader className="bg-slate-50 border-b p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {currentEditedId !== null ? "Edit Address" : "New Shipping Details"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setCurrentEditedId(null);
                  setFormData(initialAddressFormData);
                }}
                className="text-slate-400 hover:text-red-500"
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Address" : "Use This Address"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid()}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Address;
