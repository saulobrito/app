import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourierProfile } from 'appjusto-types';
import { CourierCompany } from 'appjusto-types/courier';
import { toNumber, trim } from 'lodash';
import React, { useState, useContext, useRef, useMemo, useEffect } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, ApiContext } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import AvoidingView from '../../../../common/components/containers/AvoidingView';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import { fetchPostalDetails } from '../../../../common/store/courier/actions';
import { getCourier } from '../../../../common/store/courier/selectors';
import { companyInfoSet, courierInfoSet } from '../../../../common/store/courier/validators';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../common/store/user/actions';
import { screens, padding } from '../../../../common/styles';
import { t } from '../../../../strings';
import { CourierProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'ProfileCompany'>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'ProfileCompany'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);

  // refs
  const nameRef = useRef<TextInput>(null);
  const cepRef = useRef<TextInput>(null);
  const numberRef = useRef<TextInput>(null);
  const additionalRef = useRef<TextInput>(null);

  // app state
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;

  // state
  const [cnpj, setCNPJ] = useState(courier.company?.cnpj ?? '');
  const [name, setName] = useState(courier.company?.name ?? '');
  const [cep, setCEP] = useState<string>(courier.company?.cep ?? '');
  const [address, setAddress] = useState(courier.company?.address ?? '');
  const [number, setNumber] = useState(courier.company?.number ?? '');
  const [additional, setAdditional] = useState(courier.company?.additional ?? '');
  const [city, setCity] = useState(courier.company?.city ?? '');
  const [state, setState] = useState(courier.company?.state ?? '');
  const company: CourierCompany = useMemo(
    () => ({
      cnpj,
      name: trim(name),
      cep,
      address: trim(address),
      number,
      city,
      state,
      additional: trim(additional),
    }),
    [cnpj, name, cep, address, number, city, state, additional]
  );
  const canSubmit = useMemo(() => companyInfoSet({ company }), [company]);

  // effects
  useEffect(() => {
    if (cep.length === 8) {
      (async () => {
        const result = await dispatch(fetchPostalDetails(cep));
        if (!result.error) {
          setAddress(result.logradouro);
          setCity(result.localidade);
          setState(result.uf);
          numberRef.current?.focus();
        }
      })();
    }
  }, [cep]);

  // handlers
  const updateProfileHandler = async () => {
    await dispatch(updateProfile(api)(courier.id, { company }));
    navigation.goBack();
  };

  // UI
  return (
    <PaddedView style={{ ...screens.lightGrey }}>
      <AvoidingView>
        <ScrollView>
          <DefaultInput
            title={t('CNPJ')}
            placeholder={t('Digite o CNPJ da empresa')}
            value={cnpj}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => {
              if (!isNaN(toNumber(text))) setCNPJ(text);
            }}
            onSubmitEditing={() => nameRef.current?.focus()}
            keyboardType="decimal-pad"
            maxLength={14}
          />
          <DefaultInput
            ref={nameRef}
            style={{ marginTop: padding }}
            title={t('Razão Social')}
            placeholder={t('Digite a razão social da empresa')}
            value={name}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={setName}
            onSubmitEditing={() => cepRef.current?.focus()}
            keyboardType="default"
            autoCapitalize="characters"
          />
          <DefaultInput
            ref={cepRef}
            style={{ marginTop: padding }}
            title={t('CEP')}
            placeholder={t('Digite o CEP da empresa')}
            value={cep}
            returnKeyType="next"
            onChangeText={(text) => {
              if (!isNaN(toNumber(text))) setCEP(text);
            }}
            keyboardType="decimal-pad"
            maxLength={8}
          />
          <DefaultInput
            style={{ marginTop: padding }}
            title={t('Endereço')}
            placeholder={t('Endereço')}
            value={address}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={setAddress}
            onSubmitEditing={() => numberRef.current?.focus()}
            keyboardType="default"
          />
          <View style={{ flexDirection: 'row', marginTop: padding }}>
            <DefaultInput
              ref={numberRef}
              style={{ flex: 2 }}
              title={t('Número')}
              value={number}
              placeholder={t('000')}
              keyboardType="phone-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={setNumber}
              onSubmitEditing={() => additionalRef.current?.focus()}
            />
            <DefaultInput
              ref={additionalRef}
              style={{ flex: 4, marginLeft: padding }}
              title={t('Complemento')}
              value={additional}
              placeholder={t('Sem complemento')}
              maxLength={9}
              keyboardType="default"
              returnKeyType="done"
              blurOnSubmit
              onChangeText={setAdditional}
            />
          </View>
          <View style={{ flexDirection: 'row', marginTop: padding }}>
            <DefaultInput
              style={{ flex: 8 }}
              title={t('Cidade')}
              placeholder={t('Cidade')}
              value={city}
              returnKeyType="done"
              onChangeText={setCity}
              keyboardType="default"
            />
            <DefaultInput
              style={{ flex: 2, marginLeft: padding }}
              title={t('Estado')}
              placeholder={t('UF')}
              value={state}
              maxLength={2}
              returnKeyType="done"
              onChangeText={setState}
              keyboardType="default"
            />
          </View>
          <DefaultButton
            style={{ marginVertical: padding }}
            title={t('Atualizar')}
            onPress={updateProfileHandler}
            disabled={!canSubmit || busy}
            activityIndicator={busy}
          />
        </ScrollView>
      </AvoidingView>
    </PaddedView>
  );
}
