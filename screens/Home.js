import React from 'react'
import styles from '../styles'
import { connect } from 'react-redux'
import { login } from '../redux/actions'
import * as Facebook from 'expo-facebook'
import {
    Text,
    View,
    Alert
} from 'react-native'



class Home extends React.Component {
    state = {}

    componentDidMount() {
        this.props.dispatch(login("whats up"))
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>{this.props.user}</Text>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Home);