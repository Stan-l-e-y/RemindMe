import {
  createContext,
  SetStateAction,
  useContext,
  useState,
  Dispatch,
} from 'react';

type AddEventContextValue = {
  addEvent: boolean;
  setAddEvent: Dispatch<SetStateAction<boolean>>;
};

const AddEventCtxDefaultVal: AddEventContextValue = {
  addEvent: false,
  setAddEvent: (state) => {},
};

const AddEventContext = createContext(AddEventCtxDefaultVal);

export function AddEventProvider({ children }: { children: React.ReactNode }) {
  const [addEvent, setAddEvent] = useState(AddEventCtxDefaultVal.addEvent);

  return (
    <AddEventContext.Provider value={{ addEvent, setAddEvent }}>
      {children}
    </AddEventContext.Provider>
  );
}

export function useAddEventValue() {
  const { addEvent } = useContext(AddEventContext);
  return addEvent;
}

export function useAddEventSetter() {
  const { setAddEvent } = useContext(AddEventContext);
  return setAddEvent;
}
