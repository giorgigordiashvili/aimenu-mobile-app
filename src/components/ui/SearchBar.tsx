import React from "react";
import { TextInput } from "./TextInput";
import SearchIcon from "../../assets/icons/SearchIcon";
import { colors } from "../../theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder,
}: SearchBarProps) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      leftIcon={<SearchIcon />}
      inputWrapperStyle={{ backgroundColor: colors.white }}
    />
  );
};
