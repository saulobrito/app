import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { t } from '../../../strings';
import { texts, colors, screens } from '../../styles';

export default function Terms() {
  return (
    <ScrollView>
      <View style={{ ...screens.lightGrey, marginBottom: 32 }}>
        <Text style={{ ...texts.big, marginBottom: 8, marginTop: 16 }}>
          {t('Termos de uso e política de privacidade')}
        </Text>
        <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu pulvinar justo. Ut in purus
          ipsum. Nulla molestie massa nec nunc pretium vehicula quis non magna. Nullam ac finibus
          leo. Nam ullamcorper nibh hendrerit dignissim fermentum. Integer nec lorem sollicitudin,
          ultrices neque non, tincidunt turpis. In porta elit eu erat faucibus, ac convallis risus
          lacinia. Mauris tempus, ligula in dignissim sollicitudin, dolor mi congue tellus, eu
          mollis diam nibh sit amet magna. Quisque pellentesque vehicula lacus, sed iaculis libero
          efficitur eget. Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. In eu pulvinar justo. Ut in purus ipsum. Nulla molestie massa nec nunc pretium
          vehicula quis non magna. Nullam ac finibus leo. Nam ullamcorper nibh hendrerit dignissim
        </Text>
        <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu pulvinar justo. Ut in purus
          ipsum. Nulla molestie massa nec nunc pretium vehicula quis non magna. Nullam ac finibus
          leo. Nam ullamcorper nibh hendrerit dignissim fermentum. Integer nec lorem sollicitudin,
          ultrices neque non, tincidunt turpis. In porta elit eu erat faucibus, ac convallis risus
          lacinia. Mauris tempus, ligula in dignissim sollicitudin, dolor mi congue tellus, eu
          mollis diam nibh sit amet magna. Quisque pellentesque vehicula lacus, sed iaculis libero
          efficitur eget. Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. In eu pulvinar justo. Ut in purus ipsum. Nulla molestie massa nec nunc pretium
          vehicula quis non magna. Nullam ac finibus leo. Nam ullamcorper nibh hendrerit dignissim
        </Text>
        <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu pulvinar justo. Ut in purus
          ipsum. Nulla molestie massa nec nunc pretium vehicula quis non magna. Nullam ac finibus
          leo. Nam ullamcorper nibh hendrerit dignissim fermentum. Integer nec lorem sollicitudin,
          ultrices neque non, tincidunt turpis. In porta elit eu erat faucibus, ac convallis risus
          lacinia. Mauris tempus, ligula in dignissim sollicitudin, dolor mi congue tellus, eu
          mollis diam nibh sit amet magna. Quisque pellentesque vehicula lacus, sed iaculis libero
          efficitur eget. Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. In eu pulvinar justo. Ut in purus ipsum. Nulla molestie massa nec nunc pretium
          vehicula quis non magna. Nullam ac finibus leo. Nam ullamcorper nibh hendrerit dignissim
        </Text>
      </View>
    </ScrollView>
  );
}
