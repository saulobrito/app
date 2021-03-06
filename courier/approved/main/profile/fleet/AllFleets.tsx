import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet } from 'appjusto-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import ShowIf from '../../../../../common/components/views/ShowIf';
import { observeFleets } from '../../../../../common/store/fleet/actions';
import { getAvailableFleets } from '../../../../../common/store/fleet/selectors';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { screens, colors, padding } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import FleetItem from './FleetItem';
import { FleetParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<FleetParamList, 'AllFleets'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  //context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const busy = useSelector(getUIBusy);
  //app state
  const approvedFleets = useSelector(getAvailableFleets) ?? [];
  //screen state
  const [fleetSearch, setFleetSearch] = useState('');
  // const filteredFleets = useMemo(() => {
  //   if (!approvedFleets) return [];
  //   return approvedFleets.filter(
  //     (fleet) => fleet.name.indexOf(fleetSearch) !== -1 || fleet.id.indexOf(fleetSearch) !== -1
  //   );
  // }, [approvedFleets, fleetSearch]);
  // effects
  // fetch fleets
  useEffect(() => {
    return dispatch(observeFleets(api));
  }, []);
  //handlers
  const navigateFleetDetail = useCallback((fleet: Fleet) => {
    navigation.navigate('FleetDetail', { fleet });
  }, []);

  return (
    <View style={{ ...screens.configScreen }}>
      <FlatList
        data={approvedFleets?.slice(0, 10) ?? []}
        ListHeaderComponent={
          <View style={{ marginBottom: 32, paddingHorizontal: padding }}>
            <DefaultInput
              // defaultValue={initialAddress}
              value={fleetSearch}
              title={t('Buscar')}
              placeholder={t('Nome da frota')}
              onChangeText={setFleetSearch}
              style={{ marginBottom: 32, marginTop: padding }}
            />
            <ShowIf test={approvedFleets.length === 0 && busy}>
              {() => (
                <View style={{ marginTop: 8 }}>
                  <ActivityIndicator size="small" color={colors.white} />
                </View>
              )}
            </ShowIf>
          </View>
        }
        renderItem={({ item }) => (
          <FleetItem
            onPress={() => navigateFleetDetail(item)}
            name={item.name}
            participants={item.participantsOnline}
            description={item.description}
            minimumFee={item.minimumFee}
            feePerKm={item.additionalPerKmAfterThreshold}
          />
        )}
      />
    </View>
  );
}
