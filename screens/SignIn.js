import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button,Image } from 'react-native';
import { Auth,Hub } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import Constants from 'expo-constants';
import awsconfig from '../aws-exports';
import * as Facebook from 'expo-facebook';
import * as WebBrowser from 'expo-web-browser';




export default function SignIn({ navigation, updateAuthState }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authState,setauthState] = useState('loading');
  const [authData,setauthData] = useState(null);
  const [authError,setauthError] = useState(null);
 

 Hub.listen('auth', (data) => {
        switch (data.payload.event) {
            case 'signIn':
                setauthState('signedIn');
                setauthData(data.payload.data)
                updateAuthState('loggedIn')
               
                break;
            case 'signIn_failure':
                setauthState('signIn');
                setauthData(null);
                setauthError(data.payload.data)
                
                break;
            default:
                break;
        }
    });



  async function signIn() {
    try {
      await Auth.signIn(username, password);
      console.log(' Success');
      updateAuthState('loggedIn');
    } catch (error) {
      console.log(' Error signing in...', error);
    }
  }




  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
      <TouchableOpacity style={{flexDirection:"row",alignItems:'center',justifyContent:'center',marginTop:100,marginBottom:20}}
         onPress={async ()=>{
        await Auth.federatedSignIn({provider:'Google'}).
        then(cred=>  {console.log(cred)}).
        catch(e=> console.log(e))

      }}  >
        
        <Image source={require('../assets/google.png')}  style={{ height:40,width:200,borderRadius:5,borderWidth:2}} />
    </TouchableOpacity>


        <TouchableOpacity style={{flexDirection:"row",alignItems:'center',justifyContent:'center'}}
         onPress= {async ()=>{
        await Auth.federatedSignIn({provider:'Facebook'}).
        then(cred=>  {console.log(cred)}).
        catch(e=> console.log(e))

      }}   >
        
        <Image source={require('../assets/facebook.png')}  style={{ height:40,width:200,borderRadius:5,borderWidth:2,marginBottom:20}} />
    </TouchableOpacity>    
    <Text style={{fontSize:20}}>--OR--</Text>






        <Text style={styles.title}>Sign in to your account</Text>
        <AppTextInput
          value={username}
          onChangeText={text => setUsername(text)}
          leftIcon="account"
          placeholder="Enter your phone no with code(+XX)"
          autoCapitalize="none"
          
          
        />
        <AppTextInput
          value={password}
          onChangeText={text => setPassword(text)}
          leftIcon="lock"
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />
        <AppButton title="Login" onPress={signIn} />
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.forgotPasswordButtonText}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    color: '#202020',
    fontWeight: '500',
    marginVertical: 15
  },
  footerButtonContainer: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  forgotPasswordButtonText: {
    color: 'tomato',
    fontSize: 18,
    fontWeight: '600'
  }
});