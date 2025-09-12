import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Pet } from '@/types';
import { petsApi } from '@/services/api';

interface PetsState {
  pets: Pet[];
  activePet: Pet | null;
  selectedPet: Pet | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PetsState = {
  pets: [],
  activePet: null,
  selectedPet: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPets = createAsyncThunk(
  'pets/fetchPets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await petsApi.getPets();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pets');
    }
  }
);

export const fetchPet = createAsyncThunk(
  'pets/fetchPet',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await petsApi.getPet(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pet');
    }
  }
);

export const createPet = createAsyncThunk(
  'pets/createPet',
  async (petData: any, { rejectWithValue }) => {
    try {
      const response = await petsApi.createPet(petData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create pet');
    }
  }
);

export const updatePet = createAsyncThunk(
  'pets/updatePet',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await petsApi.updatePet(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update pet');
    }
  }
);

export const deletePet = createAsyncThunk(
  'pets/deletePet',
  async (id: number, { rejectWithValue }) => {
    try {
      await petsApi.deletePet(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete pet');
    }
  }
);

export const feedPet = createAsyncThunk(
  'pets/feedPet',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await petsApi.feedPet(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to feed pet');
    }
  }
);

export const evolvePet = createAsyncThunk(
  'pets/evolvePet',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await petsApi.evolvePet(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to evolve pet');
    }
  }
);

export const fetchPetStats = createAsyncThunk(
  'pets/fetchPetStats',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await petsApi.getPetStats(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pet stats');
    }
  }
);

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPet: (state, action: PayloadAction<Pet | null>) => {
      state.selectedPet = action.payload;
    },
    setActivePet: (state, action: PayloadAction<Pet | null>) => {
      state.activePet = action.payload;
    },
    updatePetInList: (state, action: PayloadAction<Pet>) => {
      const index = state.pets.findIndex(pet => pet.id === action.payload.id);
      if (index !== -1) {
        state.pets[index] = action.payload;
      }
      
      if (state.activePet?.id === action.payload.id) {
        state.activePet = action.payload;
      }
      
      if (state.selectedPet?.id === action.payload.id) {
        state.selectedPet = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pets
      .addCase(fetchPets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pets = action.payload.pets || action.payload || [];
        state.activePet = state.pets.find(pet => pet.is_active) || null;
        state.error = null;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch pet
      .addCase(fetchPet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPet = action.payload.pet;
        state.error = null;
      })
      .addCase(fetchPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create pet
      .addCase(createPet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pets.push(action.payload.pet);
        if (action.payload.pet.is_active) {
          state.activePet = action.payload.pet;
        }
        state.error = null;
      })
      .addCase(createPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update pet
      .addCase(updatePet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedPet = action.payload.pet;
        const index = state.pets.findIndex(pet => pet.id === updatedPet.id);
        if (index !== -1) {
          state.pets[index] = updatedPet;
        }
        
        if (state.activePet?.id === updatedPet.id) {
          state.activePet = updatedPet;
        }
        
        if (state.selectedPet?.id === updatedPet.id) {
          state.selectedPet = updatedPet;
        }
        state.error = null;
      })
      .addCase(updatePet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete pet
      .addCase(deletePet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.isLoading = false;
        const petId = action.payload;
        state.pets = state.pets.filter(pet => pet.id !== petId);
        if (state.activePet?.id === petId) {
          state.activePet = state.pets.find(pet => pet.is_active) || null;
        }
        if (state.selectedPet?.id === petId) {
          state.selectedPet = null;
        }
        state.error = null;
      })
      .addCase(deletePet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Feed pet
      .addCase(feedPet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(feedPet.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update pet in lists if needed
        state.error = null;
      })
      .addCase(feedPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Evolve pet
      .addCase(evolvePet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(evolvePet.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update pet in lists if needed
        state.error = null;
      })
      .addCase(evolvePet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch pet stats
      .addCase(fetchPetStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPetStats.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle pet stats if needed
        state.error = null;
      })
      .addCase(fetchPetStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedPet, setActivePet, updatePetInList } = petsSlice.actions;
export default petsSlice.reducer;
