import React from 'react'
import styles from '../styles'
import { connect } from 'react-redux'
import { login } from '../redux/actions'
import { TabNavigation } from '../navigation/TabNavigation'
import * as firebase from 'firebase'
import * as Facebook from 'expo-facebook';
import firebaseConfig from '../config/firebase.js'

// firebase.initializeApp(firebaseConfig)
if (!firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig)
    } catch (err) {
        console.error("Firebase initialization error raised" + err.stack)
    }
}

import {
    Text,
    View,
    Alert,
    TouchableOpacity
} from 'react-native'



class Login extends React.Component {
    state = {}

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                this.props.dispatch(login(true))
                console.log("We are Auth now! " + JSON.stringify(user))
            }
        })
    }

    facebookLogin = async() => {
        console.log("facebook login")
        try {
          await Facebook.initializeAsync('240997064001051');
          const {
            type,
            token,
            expires,
            permissions,
            declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile'],
          });
          if (type === 'success') {
            const creds = await firebase.auth.FacebookAuthProvider.credential(token)

            firebase.auth().signInWithCredential(creds).catch((err) => {
                Alert.alert("Unable to Sign in " + err)
            })
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
    }

    render() {
        if (this.props.loggedIn) {
            return (
                <TabNavigation />
            )
        }
        else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.facebookLogin.bind(this)}>
                        <Text>{this.props.loggedIn}LOG IN</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        loggedIn: state.loggedIn
    }
}

export default connect(mapStateToProps)(Login);