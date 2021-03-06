import { useActionSheet } from '@expo/react-native-action-sheet';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { isEmpty } from 'lodash';
import React, { useState, useCallback, useContext, useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, ImageURISource, Dimensions } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../../../assets/icons';
import { AppDispatch, ApiContext } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import ConfigItem from '../../../../../common/components/views/ConfigItem';
import ShowIf from '../../../../../common/components/views/ShowIf';
import {
  getSelfieURL,
  getDocumentImageURL,
  uploadSelfie,
  uploadDocumentImage,
} from '../../../../../common/store/courier/actions';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { colors, texts, screens, padding } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { CourierProfileParamList } from '../types';
import DocumentButton from './DocumentButton';

const defaultImageOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
};

const { height, width } = Dimensions.get('window');

enum UploadStatus {
  Unstarted,
  Uploading,
  Done,
}

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'ProfilePhotos'>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'ProfilePhotos'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { showActionSheetWithOptions } = useActionSheet();

  // app state
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier);

  // screen state
  const [previousSelfie, setPreviousSelfie] = useState<ImageURISource | undefined | null>();
  const [previousDocumentimage, setPreviousDocumentImage] = useState<
    ImageURISource | undefined | null
  >();
  const [newSelfie, setNewSelfie] = useState<ImageURISource | undefined | null>();
  const [newDocumentImage, setNewDocumentImage] = useState<ImageURISource | undefined | null>();
  const [uploadingNewSelfie, setUploadingNewSelfie] = useState<UploadStatus>(
    UploadStatus.Unstarted
  );
  const [uploadingNewDocumentImage, setUploadingNewDocumentImage] = useState<UploadStatus>(
    UploadStatus.Unstarted
  );
  type ChangeImageType = typeof setNewSelfie;
  const canProceed = useMemo(() => {
    // no reason to upload if nothing has changed
    if (!newSelfie && !newDocumentImage) return false;
    return (newSelfie || previousSelfie) && (newDocumentImage || previousDocumentimage);
  }, [newSelfie, newDocumentImage]);

  // effects
  // check for previously stored images
  useEffect(() => {
    // undefined indicates that we don't know yet if user has uploaded selfie
    if (previousSelfie === undefined) {
      (async () => {
        console.log('checking for selfie');
        const selfieUri = await dispatch(getSelfieURL(api)(courier!.id!));
        // null means that we've checked and there's none
        if (!selfieUri) setPreviousSelfie(null);
        else setPreviousSelfie({ uri: selfieUri });
      })();
    }
  }, [previousSelfie]);
  useEffect(() => {
    // undefined indicates that we don't know yet if user has uploaded selfie
    if (previousDocumentimage === undefined) {
      (async () => {
        console.log('checking for document image');
        const documentImageUri = await dispatch(getDocumentImageURL(api)(courier!.id!));
        // null means that we've checked and there's none
        if (!documentImageUri) setPreviousDocumentImage(null);
        else setPreviousDocumentImage({ uri: documentImageUri });
      })();
    }
  }, [previousDocumentimage]);
  useEffect(() => {
    if (newSelfie) {
      setUploadingNewSelfie(UploadStatus.Uploading);
      (async () => {
        try {
          dispatch(
            uploadSelfie(api)(courier!.id!, newSelfie.uri!, (progress: number) => {
              if (progress === 100) setUploadingNewSelfie(UploadStatus.Done);
            })
          );
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [newSelfie]);
  useEffect(() => {
    if (newDocumentImage) {
      setUploadingNewDocumentImage(UploadStatus.Uploading);
      (async () => {
        try {
          dispatch(
            uploadDocumentImage(api)(courier!.id!, newDocumentImage.uri!, (progress: number) => {
              if (progress === 100) setUploadingNewDocumentImage(UploadStatus.Done);
            })
          );
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [newDocumentImage]);

  // handlers
  const pickFromCamera = useCallback(async (changeImage: ChangeImageType) => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      const result = await ImagePicker.launchCameraAsync(defaultImageOptions);
      if (result.cancelled) return;
      changeImage(result);
    } else {
      navigation.navigate('PermissionDeniedFeedback', {
        title: t('Precisamos acessar sua câmera'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
  }, []);
  const pickFromGallery = useCallback(async (changeImage: ChangeImageType) => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      const result = await ImagePicker.launchImageLibraryAsync(defaultImageOptions);
      if (result.cancelled) return;
      changeImage(result);
    } else {
      navigation.navigate('PermissionDeniedFeedback', {
        title: t('Precisamos acessar sua galeria'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
  }, []);

  const selfieCheckHandler =
    (!isEmpty(previousSelfie) && uploadingNewSelfie === UploadStatus.Unstarted) ||
    uploadingNewSelfie === UploadStatus.Done;

  const documentImageCheckHandler =
    (!isEmpty(previousDocumentimage) && uploadingNewDocumentImage === UploadStatus.Unstarted) ||
    uploadingNewDocumentImage === UploadStatus.Done;

  const actionSheetHandler = (changeImage: ChangeImageType) =>
    showActionSheetWithOptions(
      {
        options: [t('Tirar uma foto'), t('Escolher da galeria'), t('Cancelar')],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 2) {
          // cancel action
        } else if (buttonIndex === 1) {
          pickFromGallery(changeImage);
        } else if (buttonIndex === 0) {
          pickFromCamera(changeImage);
        }
      }
    );

  // UI
  return (
    <ScrollView>
      <View style={{ ...screens.configScreen }}>
        <PaddedView>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t(
              'Precisamos da sua foto para incluir nas entregas. Se você optou por Moto e/ou Carro, vamos precisar também da foto da sua CNH; caso contrário, é só enviar a foto do seu RG.'
            )}
          </Text>
        </PaddedView>

        {/* {height > 700 && <View style={{ flex: 1 }} />} */}
        <View
          style={{
            borderBottomColor: colors.grey,
            borderStyle: 'solid',
            borderBottomWidth: 1,
            marginTop: 16,
          }}
        />
        <ConfigItem
          title={t('Foto do rosto')}
          subtitle={t('Adicionar selfie')}
          onPress={() => actionSheetHandler(setNewSelfie)}
          checked={selfieCheckHandler}
        >
          {uploadingNewSelfie === UploadStatus.Uploading && (
            <View style={{ marginBottom: 16 }}>
              <RoundedText backgroundColor={colors.white}>{t('Enviando imagem')}</RoundedText>
            </View>
          )}
        </ConfigItem>
        <ConfigItem
          title={t('RG ou CNH aberta')}
          subtitle={t('Adicionar foto do documento')}
          onPress={() => actionSheetHandler(setNewDocumentImage)}
          checked={documentImageCheckHandler}
        >
          {uploadingNewDocumentImage === UploadStatus.Uploading && (
            <View style={{ marginBottom: 16 }}>
              <RoundedText backgroundColor={colors.white}>{t('Enviando imagem')}</RoundedText>
            </View>
          )}
        </ConfigItem>
        <View style={{ flex: 1 }} />
        <View style={styles.imagesContainer}>
          <TouchableOpacity onPress={() => actionSheetHandler(setNewSelfie)}>
            <DocumentButton
              title={t('Foto de rosto')}
              onPress={() => {}}
              hasTitle={!previousSelfie && !newSelfie}
            >
              <Image
                source={newSelfie ?? previousSelfie ?? icons.selfie}
                resizeMode="cover"
                style={newSelfie || previousSelfie ? styles.image : styles.icon}
              />
            </DocumentButton>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => actionSheetHandler(setNewDocumentImage)}>
            <DocumentButton
              title={t('RG ou CNH aberta')}
              onPress={() => {}}
              hasTitle={!previousDocumentimage && !newDocumentImage}
            >
              <Image
                source={newDocumentImage ?? previousDocumentimage ?? icons.license}
                resizeMode="cover"
                style={newDocumentImage || previousDocumentimage ? styles.image : styles.icon}
              />
            </DocumentButton>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ marginBottom: 32, paddingHorizontal: padding }}>
          <ShowIf test={!previousSelfie && !previousDocumentimage}>
            {() => (
              <DefaultButton
                title={t('Avançar')}
                disabled={!canProceed}
                onPress={() => navigation.goBack()}
                activityIndicator={
                  busy ||
                  uploadingNewSelfie === UploadStatus.Uploading ||
                  uploadingNewDocumentImage === UploadStatus.Uploading
                }
              />
            )}
          </ShowIf>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 48,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  imagesContainer: {
    flexDirection: height > 700 ? 'column' : 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: height > 700 ? 368 : 196,
    alignItems: 'center',
    // padding: width > 360 ? 16 : 0,
    padding: width <= 320 ? 0 : 16,
  },
});
