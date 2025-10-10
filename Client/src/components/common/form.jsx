


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
import { useState, useRef, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const quillRefs = useRef({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const getToolbarOptions = () => {
    if (isMobile) {
      return [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'clean']
      ];
    }
    
    return [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ];
  };

  const modules = {
    toolbar: getToolbarOptions(),
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video',
    'blockquote', 'code-block',
    'clean'
  ];

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
            {Icon && <Icon className="text-muted-foreground size-4" />}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showField ? <EyeOff size={18} /> : <Eye size={18} />}
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
          <div className="bg-background rounded-lg border overflow-hidden rich-text-container">
            <ReactQuill
              ref={(el) => {
                if (el) quillRefs.current[control.name] = el;
              }}
              theme="snow"
              value={value}
              onChange={(content) => handleFieldChange(control.name, content)}
              className="rich-text-editor"
              modules={modules}
              formats={formats}
              placeholder={control.placeholder || "Enter detailed description..."}
              bounds=".rich-text-container"
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col gap-4">
        {formControls.map((control) => {
          if (!shouldShowControl(control)) return null;
          return (
            <div className="grid w-full gap-2" key={control.name}>
              <Label htmlFor={control.name} className="text-sm font-medium">
                {control.label}
                {control.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {renderInputsByComponentType(control)}
              {control.helperText && (
                <p className="text-xs text-muted-foreground mt-1">
                  {control.helperText}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <Button 
        disabled={isBtnDisabled} 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        size="lg"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;