import React, { createContext, useReducer, useContext, Dispatch, ReactNode } from 'react';

// 1. Define the shape of our campaign state
interface CampaignState {
  careFlowStream: string;
  partnerName: string | null;
  campaignName: string;
  description: string;
  selectedAudienceFile: string | null;
  careGaps: { [category: string]: string[] };
}

// 2. Define the actions that can modify the state
// We use a generic approach to update any field on the top level
type CampaignAction =
  | { type: 'UPDATE_FIELD'; payload: { field: keyof CampaignState; value: any } }
  | { type: 'RESET_STATE' };

// 3. Define the initial state for the campaign
const initialState: CampaignState = {
  careFlowStream: '',
  partnerName: null,
  campaignName: '',
  description: '',
  selectedAudienceFile: null,
  careGaps: {},
};

// 4. Create the reducer function to handle state updates
const campaignReducer = (state: CampaignState, action: CampaignAction): CampaignState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

// 5. Create the context itself
interface CampaignContextProps {
  state: CampaignState;
  dispatch: Dispatch<CampaignAction>;
}

const CampaignContext = createContext<CampaignContextProps | undefined>(undefined);

// 6. Create the Provider component
interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  return (
    <CampaignContext.Provider value={{ state, dispatch }}>
      {children}
    </CampaignContext.Provider>
  );
};

// 7. Create a custom hook for easy access to the context
export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaignContext must be used within a CampaignProvider');
  }
  return context;
}; 