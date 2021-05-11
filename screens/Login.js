import React, { Component } from 'react';
import styles from '../styles'
import TabNavigation from '../navigation/TabNavigation';
import NewUser from './NewUser';
import { connect } from 'react-redux';
import { login } from '../redux/actions'
import * as firebase from 'firebase';
import firebaseConfig from '../config/firebase.js'

import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { FirebaseRecaptchaVerifierModal, FirebaseAuthApplicationVerifier } from "expo-firebase-recaptcha";
firebase.initializeApp(firebaseConfig);

class Login extends React.Component {
    state = {
        recaptchaToken: '',
        recaptchaVerifier: '',
        phoneNumber: '',
        verificationId: null,
        smsCode: '',
        message: null
    }
    recaptchaVerifier = FirebaseAuthApplicationVerifier;

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
              this.props.dispatch(login(user))
            }
        });
    }

    onPressSendVerificationCode = async () => {
        // Create an application verifier from the reCAPTCHA token
        const { recaptchaToken } = this.state;
        if (!recaptchaToken) return;
        const applicationVerifier = new FirebaseRecaptchaVerifier(recaptchaToken);

        // Start phone autenthication
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
            '+0123456789',
            applicationVerifier
        );
    };


    sendVerification = async () => {
        // The FirebaseRecaptchaVerifierModal ref implements the
        // FirebaseAuthApplicationVerifier interface and can be
        // passed directly to `verifyPhoneNumber`.

        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
            this.state.phoneNumber,
            this.recaptchaVerifier
            );
            this.setState({ verificationId });
            this.setState({
            message: "Verification code has been sent to your phone."
            });
        } catch (err) {
            this.setState({ message: `Error: ${err.message}`});
        }
    }

    verifyCode = async () => {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
            this.state.verificationId,
            this.state.smsCode
            );
            await firebase.auth().signInWithCredential(credential);
            this.setState({message: "Phone authentication successful 👍" })
        } catch (err) {
            this.setState({message: `Error: ${err.message}` })
        }
    }


    render() {
        if(this.props.loggedIn && this.props.user.newUser){
            return (
              <NewUser />
            )
          } 
          else if (this.props.loggedIn) {
            return (
              <TabNavigation/>
            )
          }
          else {
            return (
              <View style={{ padding: 20, marginTop: 50 }}>
                <FirebaseRecaptchaVerifierModal
                  firebaseConfig={firebase.app().options}
                  ref={ref => this.recaptchaVerifier = ref}
                />
      
                <Text>{this.state.message}</Text>
                <Text style={{ marginTop: 20 }}>Enter phone number</Text>
                <TextInput
                  style={{ marginVertical: 10, fontSize: 17 }}
                  placeholder="+1 999 999 9999"
                  autoFocus
                  autoCompleteType="tel"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                />
      
                <Button
                  title="Send Verification Code"
                  onPress={this.sendVerification}
                />
      
                <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
                <TextInput
                  style={{ marginVertical: 10, fontSize: 17 }}
                  editable={!!this.state.verificationId}
                  placeholder="123456"
                  onChangeText={smsCode => this.setState({ smsCode })}
                />
      
                <Button
                  title="Confirm Verification Code"
                  disabled={!this.state.verificationId}
                  onPress={this.verifyCode}
                />
      
              {this.state.message ? (
                <TouchableOpacity
                  style={[StyleSheet.absoluteFill, { backgroundColor: 0xffffffee, justifyContent: "center" }]}
                  onPress={() => this.setState({message: null})}
                  >
                  <Text style={{color: "blue", fontSize: 17, textAlign: "center", margin: 20, }}>
                    {this.state.message}
                  </Text>
                </TouchableOpacity>
              ) : undefined}
              </View>
            );
          }
    }
}

function mapStateToProps(state) {
    return {
      loggedIn: state.loggedIn,
      user: state.user
    };
  }

export default connect(mapStateToProps)(Login);