import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters'

export default function MessageBubble({ name, mine, text, ...rest }) {
    return (
        <View { ...rest } style={
            styles.message,
            mine ? styles.mine : styles.not_mine
        }>
            <View style={[
                styles.cloud,
                {
                    backgroundColor: mine ? '#dddddd' : '#0D01EB'
                }
            ]}>
            {
                name ?
                    <Text style={[
                        styles.name,
                        {
                            color: mine ? 'black' : 'white'
                        }
                    ]}>
                        {name}
                    </Text>
                :
                    null
            }
            {
                text ?
                    <Text style={[
                        styles.text,
                        {
                            color: mine ? 'black' : 'white'
                        }
                    ]}>
                        {text}
                    </Text>
                :
                    null
            }
            <View style={[
                styles.arrow_container,
                mine ? styles.arrow_left_container : styles.arrow_right_container
            ]}>
                <Svg style={mine ? styles.arrow_left : styles.arrow_right}
                    width={moderateScale(15.5, 0.6)}
                    height={moderateScale(17.5, 0.6)}
                    viewBox="32.484 17.5 15.515 17.5"
                    enable-background="new 32.484 17.5 15.515 17.5"
                >

                </Svg>

            </View>
                
            </View>
        </View>
    )
}

MessageBubble.propTypes = {
    children: PropTypes.string.isRequired,
    loading: PropTypes.bool,
};

const styles = StyleSheet.create({
    message: {
      flexDirection: 'row',
      marginVertical: moderateScale(7,2)
    },
    mine: {
      alignSelf: 'flex-start',
      marginLeft: 20,
    },
    not_mine: {
      alignSelf: 'flex-end',
      marginRight: 20
    },
    cloud: {
      maxWidth: moderateScale(250,2),
      paddingHorizontal: moderateScale(10,2),
      paddingTop: moderateScale(5,2),
      paddingBottom: moderateScale(7,2),
      borderRadius: 20,
      marginBottom: 15
    },
    text: {
      paddingTop: 3,
      fontSize: 14,
      lineHeight: 18
    },
    name: {
      fontSize: 10,
      lineHeight: 15,
      fontWeight: "bold"
    },
    arrow_container: {
      position:'absolute',
      top: 0,
      left:0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      flex: 1
    },
    arrow_left_container: {
      justifyContent: 'flex-end',
      alignItems: 'flex-start'
    },
    arrow_right_container: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end'
    },
    arrow_left: {
      left: moderateScale(-6, 0.5)
    },
    arrow_right: {
      right: moderateScale(-6, 0.5)
    }
  
})



