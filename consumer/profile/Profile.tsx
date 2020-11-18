import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Alert, ScrollView } from 'react-native';

import { ApiContext } from '../../common/app/context';
import PaddedView from '../../common/components/containers/PaddedView';
import ConfigItem from '../../common/components/views/ConfigItem';
import { signOut } from '../../common/store/user/actions';
import { screens } from '../../common/styles';
import { t } from '../../strings';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'Profile'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'Profile'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);

  // handlers
  const confirmLogout = () => {
    Alert.alert(
      t('Sair da conta'),
      t(
        'Sua conta não será excluída mas você precisará fazer login novamente para continuar usando o App.'
      ),
      [
        {
          text: t('Cancelar'),
          style: 'cancel',
        },
        {
          text: t('Confirmar'),
          style: 'destructive',
          onPress: () => signOut(api),
        },
      ]
    );
  };

  // UI
  return (
    <View style={[screens.config, screens.headless]}>
      <ScrollView>
        <PaddedView horizontal={false}>
          <ConfigItem
            title={t('Seus dados')}
            subtitle={t('Edite seus dados pessoais')}
            // onPress={() => navigation.navigate('ProfileEdit')}
            onPress={() => navigation.navigate('ProfileNavigator', { screen: 'ProfileEdit' })}
          />
          <ConfigItem
            title={t('Formas de pagamento')}
            subtitle={t('Edite suas formas de pagamento')}
            // onPress={() => navigation.navigate('ProfilePaymentMethods')}
            onPress={() =>
              navigation.navigate('ProfileNavigator', { screen: 'ProfilePaymentMethods' })
            }
          />
          <ConfigItem
            title={t('Termos de uso e política de privacidade')}
            subtitle={t('Leia os termos de uso do AppJusto')}
            // onPress={() => navigation.navigate('Terms')}
            onPress={() => navigation.navigate('ProfileNavigator', { screen: 'Terms' })}
          />
          <ConfigItem
            title={t('Sair do App')}
            subtitle={t(
              'Desconecte-se do aplicativo. Para retornar, você precisará confirmar seu e-mail cadastrado'
            )}
            onPress={confirmLogout}
          />
          <ConfigItem
            title={t('Excluir minha conta')}
            subtitle={t(
              'Todos os seus dados serão apagados do nosso sistema e você não fará mais parte do AppJusto'
            )}
            bottomBorder={false}
            // onPress={() => navigation.navigate('ProfileErase')}
            onPress={() => navigation.navigate('ProfileNavigator', { screen: 'ProfileErase' })}
          />
        </PaddedView>
      </ScrollView>
    </View>
  );
}
