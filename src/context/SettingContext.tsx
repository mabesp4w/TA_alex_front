/** @format */
"use client";
import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type ContextProps = {
  changeSetting: boolean;
  setChangeSetting: Dispatch<SetStateAction<boolean>>;
};

const SettingContext = createContext<ContextProps>({
  changeSetting: false,
  setChangeSetting: (): boolean => false,
});

const SettingContextProvider: FC<Props> = ({ children }) => {
  const [changeSetting, setChangeSetting] = useState(false);
  return (
    <SettingContext.Provider value={{ changeSetting, setChangeSetting }}>
      {children}
    </SettingContext.Provider>
  );
};

export default SettingContextProvider;

export const useSettingContext = () => useContext(SettingContext);
