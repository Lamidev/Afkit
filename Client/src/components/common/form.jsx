
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Textarea } from "../ui/textarea";
// import { Button } from "../ui/button";
// import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
// import { useState } from "react";

// function CommonForm({
//   formControls,
//   formData,
//   setFormData,
//   onSubmit,
//   buttonText,
//   isBtnDisabled,
// }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const shouldShowControl = (control) => {
//     if (!control.visibleIf) return true;

//     const { field, value } = control.visibleIf;
//     const fieldValue = formData[field];

//     // Special handling for accessory fields
//     if (control.name === "specificAccessory") {
//       return formData.category === "accessories" && formData.accessoryCategory;
//     }

//     if (Array.isArray(value)) {
//       return value.includes(fieldValue);
//     }
//     return fieldValue === value;
//   };

//   const handleFieldChange = (name, value) => {
//     const newFormData = { ...formData, [name]: value };

//     // Logic to clear irrelevant fields when category changes
//     if (name === "category") {
//       // Clear laptop-specific fields if category is not 'laptops'
//       if (value !== "laptops") {
//         newFormData.processor = "";
//         newFormData.extraFeatures = "";
//         newFormData.laptopType = "";
//       }
//       // Clear smartphone/laptop specific fields if category is not 'smartphones' or 'laptops'
//       if (!["smartphones", "laptops"].includes(value)) {
//         newFormData.ram = "";
//         newFormData.storage = "";
//       }
//       // Clear monitor-specific fields if category is not 'monitors'
//       if (value !== "monitors") {
//         newFormData.screenSize = "";
//         newFormData.frameStyle = "";
//         newFormData.screenResolution = "";
//         newFormData.ports = "";
//         newFormData.monitorType = "";
//       }
//       // Clear accessory-specific fields if category is not 'accessories'
//       if (value !== "accessories") {
//         newFormData.accessoryCategory = "";
//         newFormData.specificAccessory = "";
//       }
//       // Clear brand if category is not smartphone, laptop, or monitor
//       if (!["smartphones", "laptops", "monitors"].includes(value)) {
//         newFormData.brand = "";
//       }
//     }

//     // Clear specificAccessory when accessoryCategory changes
//     if (name === "accessoryCategory") {
//       newFormData.specificAccessory = "";
//     }

//     setFormData(newFormData);
//   };

//   function renderInputsByComponentType(getControlItem) {
//     let element = null;
//     const value = formData[getControlItem.name] || "";

//     let Icon = null;
//     if (getControlItem.name === "userName") Icon = User;
//     else if (getControlItem.name === "email") Icon = Mail;
//     else if (
//       getControlItem.name === "password" ||
//       getControlItem.name === "confirmPassword"
//     )
//       Icon = Lock;

//     const isPasswordField = getControlItem.name === "password";
//     const isConfirmPasswordField = getControlItem.name === "confirmPassword";
//     const showField = isPasswordField ? showPassword : showConfirmPassword;

//     switch (getControlItem.componentType) {
//       case "input":
//         element = (
//           <div className="flex items-center gap-2 relative">
//             {Icon && <Icon className="text-black" />}
//             <Input
//               name={getControlItem.name}
//               placeholder={getControlItem.placeholder}
//               id={getControlItem.name}
//               type={showField ? "text" : getControlItem.type}
//               value={value}
//               onChange={(event) =>
//                 handleFieldChange(getControlItem.name, event.target.value)
//               }
//               className={
//                 isPasswordField || isConfirmPasswordField ? "pr-10" : ""
//               }
//             />
//             {(isPasswordField || isConfirmPasswordField) && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (isPasswordField) setShowPassword((prev) => !prev);
//                   if (isConfirmPasswordField)
//                     setShowConfirmPassword((prev) => !prev);
//                 }}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
//               >
//                 {showField ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             )}
//           </div>
//         );
//         break;

//       case "select":
//         element = (
//           <Select
//             onValueChange={(value) =>
//               handleFieldChange(getControlItem.name, value)
//             }
//             value={value}
//           >
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder={getControlItem.label} />
//             </SelectTrigger>
//             <SelectContent>
//               {getControlItem.options?.map((optionItem) => (
//                 <SelectItem key={optionItem.id} value={optionItem.id}>
//                   {optionItem.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         );
//         break;

//       case "textarea":
//   element = (
//     <Textarea
//       name={getControlItem.name}
//       placeholder={getControlItem.placeholder}
//       id={getControlItem.id}
//       value={value}
//       onChange={(event) =>
//         handleFieldChange(getControlItem.name, event.target.value)
//       }
//       className="whitespace-pre-wrap min-h-[120px]" // Add this
//     />
//   );
//   break;

//       default:
//         element = (
//           <Input
//             name={getControlItem.name}
//             placeholder={getControlItem.placeholder}
//             id={getControlItem.name}
//             type={getControlItem.type}
//             value={value}
//             onChange={(event) =>
//               handleFieldChange(getControlItem.name, event.target.value)
//             }
//           />
//         );
//         break;
//     }

//     return element;
//   }

//   return (
//     <form onSubmit={onSubmit}>
//       <div className="flex flex-col gap-3">
//         {formControls.map((controlItem) => {
//           if (!shouldShowControl(controlItem)) return null;

//           return (
//             <div className="grid w-full gap-1.5" key={controlItem.name}>
//               <Label className="mb-1">{controlItem.label}</Label>
//               {renderInputsByComponentType(controlItem)}
//             </div>
//           );
//         })}
//       </div>
//       <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
//         {buttonText || "Submit"}
//       </Button>
//     </form>
//   );
// }

// export default CommonForm;

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import ReactQuill from 'react-quill-new';
import "react-quill-new/dist/quill.snow.css";


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

    if (control.name === "specificAccessory") {
      return formData.category === "accessories" && formData.accessoryCategory;
    }

    if (Array.isArray(value)) return value.includes(fieldValue);
    return fieldValue === value;
  };

  const handleFieldChange = (name, value) => {
    const newFormData = { ...formData, [name]: value };

    if (name === "category") {
      if (value !== "laptops") {
        newFormData.processor = "";
        newFormData.extraFeatures = "";
        newFormData.laptopType = "";
      }
      if (!["smartphones", "laptops"].includes(value)) {
        newFormData.ram = "";
        newFormData.storage = "";
      }
      if (value !== "monitors") {
        newFormData.screenSize = "";
        newFormData.frameStyle = "";
        newFormData.screenResolution = "";
        newFormData.ports = "";
        newFormData.monitorType = "";
      }
      if (value !== "accessories") {
        newFormData.accessoryCategory = "";
        newFormData.specificAccessory = "";
      }
      if (!["smartphones", "laptops", "monitors"].includes(value)) {
        newFormData.brand = "";
      }
    }

    if (name === "accessoryCategory") {
      newFormData.specificAccessory = "";
    }

    setFormData(newFormData);
  };

  const renderInputsByComponentType = (control) => {
    const value = formData[control.name] || "";
    let element = null;

    let Icon = null;
    if (control.name === "userName") Icon = User;
    else if (control.name === "email") Icon = Mail;
    else if (["password", "confirmPassword"].includes(control.name)) Icon = Lock;

    const isPasswordField = control.name === "password";
    const isConfirmPasswordField = control.name === "confirmPassword";
    const showField = isPasswordField ? showPassword : showConfirmPassword;

    switch (control.componentType) {
      case "input":
        element = (
          <div className="flex items-center gap-2 relative">
            {Icon && <Icon className="text-black" />}
            <Input
              name={control.name}
              placeholder={control.placeholder}
              id={control.name}
              type={showField ? "text" : control.type}
              value={value}
              onChange={(e) => handleFieldChange(control.name, e.target.value)}
              className={
                isPasswordField || isConfirmPasswordField ? "pr-10" : ""
              }
            />
            {(isPasswordField || isConfirmPasswordField) && (
              <button
                type="button"
                onClick={() => {
                  if (isPasswordField) setShowPassword((p) => !p);
                  if (isConfirmPasswordField) setShowConfirmPassword((p) => !p);
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
            onValueChange={(value) => handleFieldChange(control.name, value)}
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={control.label} />
            </SelectTrigger>
            <SelectContent>
              {control.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <div className="bg-white rounded-md border">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={(content) => handleFieldChange(control.name, content)}
              className="min-h-[280px] mb-16"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  [{ 'align': [] }],
                  ['link', 'blockquote', 'code-block'],
                  ['clean']
                ],
              }}
              formats={[
                'header', 
                'bold', 'italic', 'underline', 'strike', 
                'list', 'bullet', 'indent',
                'link', 'blockquote', 'code-block',
                'align'
              ]}
            />
          </div>
        );
        break;

      default:
        element = (
          <Input
            name={control.name}
            placeholder={control.placeholder}
            id={control.name}
            type={control.type}
            value={value}
            onChange={(e) => handleFieldChange(control.name, e.target.value)}
          />
        );
        break;
    }

    return element;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control) => {
          if (!shouldShowControl(control)) return null;
          return (
            <div className="grid w-full gap-1.5" key={control.name}>
              <Label className="mb-1">{control.label}</Label>
              {renderInputsByComponentType(control)}
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