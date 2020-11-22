import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';

import {signOut} from '~/store/modules/auth/actions';
import { updateProfileRequest } from '~/store/modules/user/actions';

import Background from '~/components/Background';

import api from '~/services/api';

import {
  Container,
  Title,
  Form,
  FormInput,
  Separator,
  SubmitButton,
  LogoutButton,
  AvatarContainer,
  Avatar,
  ButtonChose
} from './styles';

export default function Profile() {
  const profile = useSelector(state => state.user.profile);
  const dispatch = useDispatch();

  const emailRef = useRef();
  const oldPasswordRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState();
  const [flagAvatar, setFlagAvatar] = useState(1);
  const [filenameHex, setFilenameHex] = useState('');

  useEffect(() => {
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
  }, [profile]);

  function handleSubmit() {
    dispatch(
      updateProfileRequest({
        name,
        email,
        oldPassword,
        password,
        confirmPassword,
      })
    );
  }

  useEffect(() => {
    imgProfile(profile.image);
  }, []);

  function handleLogout() {
    dispatch(signOut());
  }

  async function uploadImage() {
    console.log('entrei upload');
    const file = {
      uri: avatar.uri,
      name: avatar.fileName,
      type: avatar.type
    }
    console.log(file);
    const body = new FormData()
    body.append('file', file)
    
    try {
      await fetch('https://borapraticar-backend.herokuapp.com/upload', {
      method: 'POST',
      body
    }).then(response => response.json())
      .then(result => {
        console.log('entrei primeiro result');
        let { filenameHex } = result;
        setFilenameHex(filenameHex);
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (flagAvatar == 2) {
      uploadImage();
    }
  }, [flagAvatar]);

  async function imagePickerCallback(data) {
    if (data.didCancel) {
      return;
    }

    if (data.error) {
      console.log('entrei')
      return;
    }

    if (!data.uri) {
      return;
    }

    setAvatar(data);
    setFlagAvatar(2);
  }

  async function imgProfile(filename) {
    const response = await api.get(`/image/${filename}`);

    const number = response.data.base64;

    setAvatar(number);

  }

  async function uploadImageProfile() {
    try {
      await api.put(`/updateImg`, { filenameHex });

      Alert.alert(
        'Sucesso!',
        'A sua foto de perfil foi alterada.'
      );
    } catch(err) {
      Alert.alert(
        'Falha!',
        'Falha ao alterar a foto de perfil. Tente novamente'
      );
    }
  }

  useEffect(() => {
    if (filenameHex != '') {
      uploadImageProfile();
      profile.image = filenameHex;
    }
  }, [filenameHex]);

  return (
    <Background>
      <Container>
        <Title>Meu perfil</Title>
        <Form>
          <AvatarContainer>
            <Avatar source={{
                uri: avatar
                  ? ( avatar.uri ? avatar.uri : avatar )
                  : "https://k2partnering.com/wp-content/uploads/2016/05/Person.jpg" 
            }} />
            <ButtonChose onPress={() => ImagePicker.showImagePicker({}, imagePickerCallback)}>
              Escolher imagem
            </ButtonChose>
            
          </AvatarContainer>
          <FormInput
            icon="account"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Nome completo"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            value={name}
            onChangeText={setName}
          />
          <FormInput
            icon="email"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu email"
            ref={emailRef}
            returnKeyType="next"
            onSubmitEditing={() => oldPasswordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <Separator />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Digite sua senha atual"
            ref={oldPasswordRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Digite sua nova senha"
            ref={passwordRef}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
            value={password}
            onChangeText={setPassword}
          />
          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Confirme sua nova senha"
            ref={confirmPasswordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <SubmitButton onPress={handleSubmit}>Atualizar perfil</SubmitButton>
          <LogoutButton onPress={handleLogout}>Sair</LogoutButton>
        </Form>
      </Container>
    </Background>
  );
}

Profile.navigationOptions = {
  tabBarLabel: 'Meu perfil',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="person" size={20} color={tintColor} />
  ),
};
