
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const shouldShowControl = (control) => {
    if (!control.visibleIf) return true;

    const { field, value } = control.visibleIf;
    const fieldValue = formData[field];

    // Special handling for accessory fields
    if (control.name === "specificAccessory") {
      return formData.category === "accessories" && formData.accessoryCategory;
    }

    if (Array.isArray(value)) {
      return value.includes(fieldValue);
    }
    return fieldValue === value;
  };

  const handleFieldChange = (name, value) => {
    const newFormData = { ...formData, [name]: value };

    // Logic to clear irrelevant fields when category changes
    if (name === "category") {
      // Clear laptop-specific fields if category is not 'laptops'
      if (value !== "laptops") {
        newFormData.processor = "";
        newFormData.extraFeatures = "";
        newFormData.laptopType = "";
      }
      // Clear smartphone/laptop specific fields if category is not 'smartphones' or 'laptops'
      if (!["smartphones", "laptops"].includes(value)) {
        newFormData.ram = "";
        newFormData.storage = "";
      }
      // Clear monitor-specific fields if category is not 'monitors'
      if (value !== "monitors") {
        newFormData.screenSize = "";
        newFormData.frameStyle = "";
        newFormData.screenResolution = "";
        newFormData.ports = "";
        newFormData.monitorType = "";
      }
      // Clear accessory-specific fields if category is not 'accessories'
      if (value !== "accessories") {
        newFormData.accessoryCategory = "";
        newFormData.specificAccessory = "";
      }
      // Clear brand if category is not smartphone, laptop, or monitor
      if (!["smartphones", "laptops", "monitors"].includes(value)) {
        newFormData.brand = "";
      }
    }

    // Clear specificAccessory when accessoryCategory changes
    if (name === "accessoryCategory") {
      newFormData.specificAccessory = "";
    }

    setFormData(newFormData);
  };

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    let Icon = null;
    if (getControlItem.name === "userName") Icon = User;
    else if (getControlItem.name === "email") Icon = Mail;
    else if (
      getControlItem.name === "password" ||
      getControlItem.name === "confirmPassword"
    )
      Icon = Lock;

    const isPasswordField = getControlItem.name === "password";
    const isConfirmPasswordField = getControlItem.name === "confirmPassword";
    const showField = isPasswordField ? showPassword : showConfirmPassword;

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="flex items-center gap-2 relative">
            {Icon && <Icon className="text-black" />}
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={showField ? "text" : getControlItem.type}
              value={value}
              onChange={(event) =>
                handleFieldChange(getControlItem.name, event.target.value)
              }
              className={
                isPasswordField || isConfirmPasswordField ? "pr-10" : ""
              }
            />
            {(isPasswordField || isConfirmPasswordField) && (
              <button
                type="button"
                onClick={() => {
                  if (isPasswordField) setShowPassword((prev) => !prev);
                  if (isConfirmPasswordField)
                    setShowConfirmPassword((prev) => !prev);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
              >
                {showField ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        );
        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              handleFieldChange(getControlItem.name, value)
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              handleFieldChange(getControlItem.name, event.target.value)
            }
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              handleFieldChange(getControlItem.name, event.target.value)
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => {
          if (!shouldShowControl(controlItem)) return null;

          return (
            <div className="grid w-full gap-1.5" key={controlItem.name}>
              <Label className="mb-1">{controlItem.label}</Label>
              {renderInputsByComponentType(controlItem)}
            </div>
          );
        })}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;