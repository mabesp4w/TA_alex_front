/** @format */

import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

// Generic type for any data object
type DataObject = Record<string, any>;

type Props<T extends DataObject> = {
  label?: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  required?: boolean;
  name: string;
  errors?: any;
  placeholder?: string;
  addClass?: string;
  labelClass?: string;
  initialValues?: string[]; // Array of strings for initial values
  maxTags?: number;
  dataTag: T[]; // Array of available options as objects
  displayKey: keyof T; // Key to display in UI (e.g., "category_nm", "name", etc.)
  valueKey: keyof T; // Key to use for storing values (e.g., "category_nm", "id", etc.)
  storeObjectData?: boolean; // If true, store full objects; if false, store only the values
};

function InputTag<T extends DataObject>({
  label,
  register,
  setValue,
  required,
  name,
  errors,
  placeholder = "Tambahkan tag...",
  addClass,
  labelClass,
  initialValues = [],
  maxTags,
  dataTag,
  displayKey,
  valueKey,
  storeObjectData = false, // Default to storing only values, not full objects
}: Props<T>) {
  // For internal component state, we need to track the full objects to display properly
  const [selectedTags, setSelectedTags] = useState<T[]>([]);

  // Initialize selected tags from initialValues
  useEffect(() => {
    if (initialValues.length > 0) {
      // Find the matching objects from dataTag that correspond to initialValues
      const initialObjects = initialValues
        .map((value) => {
          return (
            dataTag.find((item) => String(item[valueKey]) === value) || null
          );
        })
        .filter((item) => item !== null) as T[];

      setSelectedTags(initialObjects);
    }
  }, [initialValues, dataTag, valueKey]);

  const [inputValue, setInputValue] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<T[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Register the field with react-hook-form with validation rules
  useEffect(() => {
    register(name, {
      required: required ? "This field is required" : false,
      validate: {
        notEmpty: (value) => {
          // For required fields, we need to check if the array has at least one item
          if (
            required &&
            (!value || (Array.isArray(value) && value.length === 0))
          ) {
            return false;
          }
          return true;
        },
      },
    });
  }, [register, name, required]);

  // Update form value when selectedTags changes
  useEffect(() => {
    if (storeObjectData) {
      // Store full objects
      setValue(name, selectedTags);
    } else {
      // Store only values from the valueKey
      const valuesOnly = selectedTags.map((tag) => String(tag[valueKey]));
      setValue(name, valuesOnly);
    }
  }, [selectedTags, setValue, name, valueKey, storeObjectData]);

  // Filter suggestions based on input value
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = dataTag.filter((item) => {
      const displayValue = String(item[displayKey] || "").toLowerCase();
      const inputLower = inputValue.toLowerCase();

      // Check if the item's display value includes the input text
      // and the item is not already in the selected tags
      return (
        displayValue.includes(inputLower) &&
        !selectedTags.some(
          (tag) => String(tag[valueKey]) === String(item[valueKey])
        )
      );
    });
    setFilteredSuggestions(filtered);
  }, [inputValue, dataTag, selectedTags, displayKey, valueKey]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addTag = (tagText: string) => {
    const trimmedTagText = tagText.trim();

    if (!trimmedTagText) return;

    // Find the matching item in dataTag
    const matchingItem = dataTag.find(
      (item) =>
        String(item[displayKey]).toLowerCase() === trimmedTagText.toLowerCase()
    );

    // Only add if we found a matching item and it's not already in the selected tags
    if (
      matchingItem &&
      !selectedTags.some(
        (tag) => String(tag[valueKey]) === String(matchingItem[valueKey])
      )
    ) {
      if (maxTags && selectedTags.length >= maxTags) {
        return;
      }

      const newTags = [...selectedTags, matchingItem];
      setSelectedTags(newTags);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (index: number, e: React.MouseEvent) => {
    // Prevent event propagation to avoid triggering other click handlers
    e.preventDefault();
    e.stopPropagation();

    // Create a new array without the tag at the specified index
    const newTags = [...selectedTags];
    newTags.splice(index, 1);

    // Update the tags state
    setSelectedTags(newTags);

    // Refocus the input after removing a tag
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue) {
        addTag(inputValue);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (
      e.key === "ArrowDown" &&
      filteredSuggestions.length > 0 &&
      showSuggestions
    ) {
      e.preventDefault();
      const firstSuggestion = document.querySelector(
        ".suggestion-item"
      ) as HTMLElement;
      if (firstSuggestion) {
        firstSuggestion.focus();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Don't allow commas in the input as we use those as separators
    setInputValue(value.replace(/,/g, ""));
    setShowSuggestions(value.trim() !== "");
  };

  const handleBlur = () => {
    // We need a longer delay to ensure click on suggestion completes first
    // before checking if we should add the input value as a tag
    setTimeout(() => {
      if (inputValue && !showSuggestions) {
        addTag(inputValue);
      }
    }, 300);
  };

  const handleSuggestionKeyDown = (e: React.KeyboardEvent, suggestion: T) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(String(suggestion[displayKey]));
      inputRef.current?.focus();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const currentIndex = filteredSuggestions.findIndex(
        (item) => String(item[valueKey]) === String(suggestion[valueKey])
      );
      const nextElement = document.querySelectorAll(".suggestion-item")[
        currentIndex + 1
      ] as HTMLElement;
      if (nextElement) {
        nextElement.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const currentIndex = filteredSuggestions.findIndex(
        (item) => String(item[valueKey]) === String(suggestion[valueKey])
      );
      if (currentIndex === 0) {
        inputRef.current?.focus();
      } else {
        const prevElement = document.querySelectorAll(".suggestion-item")[
          currentIndex - 1
        ] as HTMLElement;
        if (prevElement) {
          prevElement.focus();
        }
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: T) => {
    // Only add the tag if it's not already in the list and we haven't reached max tags
    if (
      !selectedTags.some(
        (tag) => String(tag[valueKey]) === String(suggestion[valueKey])
      )
    ) {
      if (maxTags && selectedTags.length >= maxTags) {
        return;
      }

      // Force update the tags state directly
      const newTags = [...selectedTags, suggestion];
      setSelectedTags(newTags);

      // Clear input and hide suggestions
      setInputValue("");
      setShowSuggestions(false);
    }

    // Return focus to input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <label className={`relative ${addClass}`}>
      <div className="flex">
        {label && (
          <div className={`label ${labelClass}`}>
            <span className={`label-text ${labelClass}`}>{label}</span>
          </div>
        )}
        {required && label && (
          <span className="ml-1 text-red-600 self-center">*</span>
        )}
        {!required && label && (
          <span className="label-text ml-1 self-center">(Optional)</span>
        )}
      </div>

      <div className="input input-bordered w-full text-gray-600 flex flex-wrap gap-1 items-center min-h-16 p-1">
        {selectedTags.map((tag, index) => (
          <div
            key={String(tag[valueKey])}
            className="badge badge-primary badge-lg gap-1"
          >
            {String(tag[displayKey])}
            <button
              type="button"
              onClick={(e) => removeTag(index, e)}
              className="bg-primary-focus rounded-full p-1"
            >
              <IoMdClose size={14} />
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => inputValue.trim() !== "" && setShowSuggestions(true)}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          className="grow border-none focus:outline-none bg-transparent min-w-20"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {filteredSuggestions.map((suggestion) => (
              <li
                key={String(suggestion[valueKey])}
                tabIndex={0}
                className="suggestion-item px-4 py-2 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSuggestionClick(suggestion);
                }}
                onKeyDown={(e) => handleSuggestionKeyDown(e, suggestion)}
              >
                {String(suggestion[displayKey])}
              </li>
            ))}
          </ul>
        </div>
      )}

      {maxTags && (
        <div className="text-xs text-gray-500 mt-1">
          {selectedTags.length}/{maxTags} tags
        </div>
      )}

      {errors && errors[name] && errors[name]?.type === "required" && (
        <p className="text-red-600 italic text-sm">
          {`${label || name} tidak boleh kosong`}
        </p>
      )}
    </label>
  );
}

export default InputTag;
