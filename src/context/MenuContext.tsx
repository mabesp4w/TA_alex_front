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
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const MenuContext = createContext<ContextProps>({
  isOpen: false,
  setIsOpen: (): boolean => false,
});

const MenuContextProvider: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContextProvider;

export const useMenuContext = () => useContext(MenuContext);
