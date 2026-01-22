import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from './auth/authSlice.js';
import { tablesSlice } from './tables/tablesSlice.js';
import { uiSlice } from './ui/uiSlice.js';
import { datosSlice } from './tables/datosSlice.js';


export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    tables: tablesSlice.reducer,
    auth: authSlice.reducer,
    datos: datosSlice.reducer
  },
});
