import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileSituation } from 'appjusto-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQueryCache } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';

import { ApiContext, AppDispatch } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import ConfigItem from '../../common/components/views/ConfigItem';
import useCourierDocumentImage from '../../common/hooks/queries/useCourierDocumentImage';
import useCourierSelfie from '../../common/hooks/queries/useCourierSelfie';
import { submitProfile } from '../../common/store/courier/actions';
import { getCourier } from '../../common/store/courier/selectors';
import {
  courierInfoSet,
  bankAccountSet,
  companyInfoSet,
} from '../../common/store/courier/validators';
import { getUIBusy } from '../../common/store/ui/selectors';
import { screens, texts, colors } from '../../common/styles';
import { t } from '../../strings';
import { PendingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<PendingParamList, 'ProfilePending'>;
type ScreenRouteProp = RouteProp<PendingParamList, 'ProfilePending'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const queryCache = useQueryCache();

  // app state
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;
  const currentSelfieQuery = useCourierSelfie(courier.id);
  const currentDocumentImageQuery = useCourierDocumentImage(courier.id);

  // screen state
  const situationsAllowed: ProfileSituation[] = ['pending'];
  const hasPersonalInfo = courierInfoSet(courier);
  const hasCompanyInfo = companyInfoSet(courier);
  const hasImages = !!currentSelfieQuery.data && !!currentDocumentImageQuery.data;
  const hasBankAccount = bankAccountSet(courier);
  const hasSelectedFleet = courier.fleet !== undefined;
  const totalSteps = 5;
  const [stepsDone, setStepsDone] = useState(0);
  const submitEnabled =
    situationsAllowed.indexOf(courier.situation) > -1 && stepsDone === totalSteps;

  // side effects
  // once
  useEffect(() => {
    // although this screen is named 'ProfilePending', it's also the first screen of UnapprovedNavigator
    // which means that it will be shown if courier is rejected. so, if that's the case,
    // we navigate to ProfileRejected after a short delay to make sure it will work on all devices
    if (courier.situation === 'rejected') {
      setTimeout(() => {
        navigation.replace('ProfileRejected');
      }, 500);
    }
  }, []);
  // whenever situation changes
  useEffect(() => {
    if (courier.situation === 'submitted') {
      navigation.replace('ProfileSubmitted');
    }
  }, [courier.situation]);

  // whenever state updates
  // recalculate steps done
  useEffect(() => {
    let totalSteps = 0;
    if (hasPersonalInfo) totalSteps++;
    if (hasCompanyInfo) totalSteps++;
    if (hasImages) totalSteps++;
    if (hasBankAccount) totalSteps++;
    if (hasSelectedFleet) totalSteps++;
    setStepsDone(totalSteps);
  }, [
    hasPersonalInfo,
    hasBankAccount,
    currentSelfieQuery.data,
    currentDocumentImageQuery.data,
    hasSelectedFleet,
    hasCompanyInfo,
  ]);
  // whenever screen is focused
  useEffect(() => {
    navigation.addListener('focus', focusHandler);
    return () => navigation.removeListener('focus', focusHandler);
  });

  // handlers
  const submitHandler = useCallback(() => {
    dispatch(submitProfile(api));
  }, []);
  // when focused, refetch queries to recalculate of steps done
  const focusHandler = useCallback(() => {
    queryCache.refetchQueries();
  }, []);

  // UI
  return (
    <View style={[screens.config, screens.headless]}>
      <ScrollView>
        {/* header */}
        <PaddedView>
          <Text style={{ ...texts.big, marginBottom: 24 }}>{t('Cadastro de novo entregador')}</Text>
          <DefaultButton
            title={t('Enviar cadastro')}
            onPress={submitHandler}
            disabled={!submitEnabled || busy}
            activityIndicator={busy}
          />
          <Text style={[texts.default, { color: colors.darkGrey, paddingTop: 16 }]}>
            {t(
              'Preencha os dados a seguir e envie seu cadastro. Em até um dia você poderá começar a fazer suas entregas.'
            )}
          </Text>
          <Text style={{ ...texts.default, color: colors.darkGreen, paddingTop: 16 }}>
            {stepsDone} {t('de')} {totalSteps} {t('dados preenchidos')}
          </Text>
        </PaddedView>
        <View
          style={{
            borderBottomColor: colors.grey,
            borderStyle: 'solid',
            borderBottomWidth: 1,
            // marginTop: 16,
          }}
        />
        <ConfigItem
          title={t('Seus dados')}
          subtitle={t('Preencha seus dados pessoais')}
          onPress={() => navigation.navigate('ProfileEdit')}
          checked={courierInfoSet(courier)}
        />
        <ConfigItem
          title={t('Dados da sua empresa')}
          subtitle={t('Preencha os dados da sua empresa ou MEI')}
          onPress={() => navigation.navigate('ProfileCompany')}
          checked={companyInfoSet(courier)}
        />
        <ConfigItem
          title={t('Fotos e documentos')}
          subtitle={t('Envie uma selfie e seus documentos')}
          onPress={() => navigation.navigate('ProfilePhotos')}
          checked={hasImages}
        />
        <ConfigItem
          title={t('Dados bancários')}
          subtitle={t('Cadastre seu banco para recebimento')}
          onPress={() => navigation.navigate('BankNavigator')}
          checked={bankAccountSet(courier)}
        />
        <ConfigItem
          title={t('Escolha sua frota')}
          subtitle={t('Faça parte de uma frota existente ou crie sua própria frota')}
          onPress={() => navigation.navigate('FleetNavigator')}
          checked={hasSelectedFleet}
          bottomBorder={false}
        />
      </ScrollView>
    </View>
  );
}
