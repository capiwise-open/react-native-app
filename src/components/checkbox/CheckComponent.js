
import { StyleSheet, View } from "react-native"; 
import React from "react"; 
import CheckBox from '@react-native-community/checkbox';
  
export default function CheckComponent (props) {  
    return ( 
        <View style={styles.container}>
            <View style={[styles.layout, {backgroundColor:props.checked?'#FFF':'transparent'}]}>
                <CheckBox
                    style={{ transform: [{ scaleX: props.checked?1.4:1.2 }, { scaleY: props.checked?1.4:1.2 }]}}
                    value={props.checked}
                    onValueChange={props.onPress}
                />
            </View>
        </View>
    ); 
}; 
  
const styles = StyleSheet.create({ 
    container: {
        alignItems:'center',
        justifyContent:'center',
        marginRight: 5,
        backgroundColor: "#fff",
        borderRadius:5,
        borderWidth:1,
        borderColor:'#979797',
        backgroundColor:'transparent'
    },
    layout:{
        width:22, 
        height:22, 
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
    }
}); 