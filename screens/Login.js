import * as Facebook from 'expo-facebook';
import * as firebase from 'firebase'
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import firebaseConfig from '../config/firebase.js'
import { TabNavigation } from '../navigation/TabNavigation'
import { login } from '../redux/actions'
import { signInWithFacebook } from '../utils/auth'

firebase.initializeApp(firebaseConfig)

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

    facebookLogin = async () => {
        try {
            await Facebook.initializeAsync('240997064001051');
            const { type, token } = await Facebook.logInWithReadPermissionsAsync(
                "240997064001051",
                { permission: "public_profile" });

            if (type == "success") {
                console.log("SUCESSFUL FACEBOOK LOGIN")
                const credential =
                    firebase
                        .auth
                        .FacebookAuthProvider
                        .credential(token);

                firebase
                    .auth().signInWithCredential(credential).catch(error => {
                        console.log(error);
                    });
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }


    }


    // facebookLogin = async() => {
    //     try {
    //   await Facebook.initializeAsync('240997064001051');
    //       const {
    //         type,
    //         token,
    //         expires,
    //         permissions,
    //         declinedPermissions,
    //       } = await Facebook.logInWithReadPermissionsAsync('240997064001051', {
    //         permissions: 'public_profile',
    //       });
    //       if (type === 'success') {
    //         // Get the user's name using Facebook's Graph API
    //         // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    //         // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);

    //         const creds = await firebase.auth.FacebookAuthProvider.credential(token)
    //         firebase.auth().signInWithCredential(creds).catch((err) => {
    //             Alert.alert("UH oH Sphaget " + err)
    //         })
    //       } else {
    //         // type === 'cancel'
    //       }
    //     } catch ({ message }) {
    //       alert(`Facebook Login Error: ${message}`);
    //     }
    //   }


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