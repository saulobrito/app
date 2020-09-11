import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { BUSY } from '../ui/actions';

export const UPDATE_AVAILABLE_CITIES = 'UPDATE_AVAILABLE_CITIES';
export const UPDATE_ALL_CITIES = 'UPDATE_ALL_CITIES';
export const UPDATE_APPROVED_FLEETS = 'UPDATE_APPROVED_FLEETS';

export const fetchAvailableCities = (api: Api) => async (dispatch: AppDispatch) => {
  dispatch({ type: BUSY, payload: true });
  const cities = await api.fleet().fetchAvailableCities();
  dispatch({ type: UPDATE_AVAILABLE_CITIES, payload: cities });
  dispatch({ type: BUSY, payload: false });
};

export const fetchAllCities = (api: Api) => async (dispatch: AppDispatch) => {
  dispatch({ type: BUSY, payload: true });
  const cities = await api.fleet().fetchAllCities();
  dispatch({ type: UPDATE_ALL_CITIES, payload: cities });
  dispatch({ type: BUSY, payload: false });
};

export const fetchApprovedFleets = (api: Api) => (cityId: string) => async (
  dispatch: AppDispatch
) => {
  dispatch({ type: BUSY, payload: true });
  const fleets = await api.fleet().fetchApprovedFleets(cityId);
  dispatch({ type: UPDATE_APPROVED_FLEETS, payload: fleets });
  dispatch({ type: BUSY, payload: false });
};
