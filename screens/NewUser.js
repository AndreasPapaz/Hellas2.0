import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uploadImages, addFirstImage, updateAboutMe, updateName, logout, newUser } from '../redux/actions';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles'
import { Text, View, TextInput, Image, Button, StyleSheet, TouchableOpacity, Platform } from "react-native";


class NewUser extends Component {
    addProfileImage(){ 
        this.props.dispatch(addFirstImage());
    }

    render() {
        let image;
        if (this.props.user.photoUrl) {
            image = <Image style={styles.img} source={{uri: this.props.user.photoUrl}}/>
        }
        else {
            image = <Image style={styles.img} source={require('../assets/profile.png')}/>
        }
        return(
            <View style={{ padding: 20, marginTop: 20}}>
                {image}
                <TouchableOpacity style={[styles.img, styles.center]} onPress={this.addProfileImage.bind(this)}>
                    <Ionicons name="ios-add" size={75}  style={styles.color} />
                </TouchableOpacity>
                
                <Text>Name</Text>
                <TextInput
                    style={{ marginVertical: 10, fontSize: 17 }}
                    placeholder={this.props.user.name}
                    autoFocus
                    autoCompleteType="name"
                    keyboardType="default"
                    textContentType="givenName"
                    onChangeText={(name) => this.props.dispatch(updateName(name))}
                />

                <Text>About Me</Text>
                <TextInput
                    style={styles.textInput}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={(text) => this.props.dispatch(updateAboutMe(text))}
                    value={this.props.user.aboutMe}
                />

                <TouchableOpacity onPress={ () => this.props.dispatch(newUser(this.props.user)) }>
                    <Text style={ styles.button }>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
      user: state.user
    };
  }

export default connect(mapStateToProps)(NewUser);