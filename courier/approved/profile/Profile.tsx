import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { ApiContext } from '../../../common/app/context';
import ArrowBox from '../../../common/components/ArrowBox';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { ProfileParamList } from '../../../common/screens/profile/types';
import { signOut } from '../../../common/store/user/actions';
import { colors, texts, screens, padding } from '../../../common/styles';
import { t } from '../../../strings';

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
    <View style={styles.screen}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileEdit', { allowPartialSave: false })}
      >
        <View style={styles.container}>
          <View style={styles.texts}>
            <Text style={styles.black}>{t('Seus dados')}</Text>
            <Text style={styles.darkGrey}>{t('Edite seus dados pessoais')}</Text>
          </View>
          <View style={styles.button}>
            <ArrowBox />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Terms');
        }}
      >
        <View style={styles.container}>
          <View style={styles.texts}>
            <Text style={styles.black}>{t('Termos de uso e política de privacidade')}</Text>
            <Text style={styles.darkGrey}>{t('Leia os termos de uso do AppJusto')}</Text>
          </View>
          <View style={styles.button}>
            <ArrowBox />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={confirmLogout}>
        <View style={styles.container}>
          <View style={styles.texts}>
            <Text style={styles.black}>{t('Sair do app')}</Text>
            <Text style={styles.darkGrey}>
              {t(
                'Desconecte-se do aplicativo. Para retornar, você precisará confirmar seu e-mail cadastrado'
              )}
            </Text>
          </View>
          <View style={styles.button}>
            <ArrowBox />
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <DefaultButton title={t('Sair da conta')} onPress={confirmLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...screens.lightGrey,
    paddingBottom: padding,
  },
  container: {
    flexDirection: 'row',
    marginTop: 16,
    borderBottomColor: colors.grey,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  texts: {},
  black: {
    paddingBottom: 8,
    ...texts.default,
  },
  darkGrey: {
    paddingBottom: 16,
    ...texts.default,
    color: colors.darkGrey,
  },
  button: {
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    paddingBottom: 28,
  },
});