import React, {useEffect, useState} from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {Calendar} from 'react-native-calendars';
import { globalStyle } from '../../assets/css/globalStyle';
import moment from 'moment';

export default function ModalCalendar({onShow, onClose, onConfirm}){
    const [selected, setSelected] = useState('')
    const [title, setTitle] = useState("")

    useEffect(()=>{
        setTitle(moment().format('dddd, MMM D'))
    }, [])

    return(
        <Modal
            animationType="slide"
            transparent={true}
            visible={onShow}
            onRequestClose={onClose}
        >
            <View style={[globalStyle.flexColumn, styles.modalBody]}>
                <View style={styles.calendarTitle}>
                    <Text style={{fontSize:16, fontWeight:'bold',color:'#FFF'}}>{title}</Text>
                    <Text style={{fontSize:16, fontWeight:'bold',color:'#FFF'}}>{selected?.substring(0, 4)}</Text>
                </View>
                <Calendar
                    minDate={moment().year() + '-01-01'}
                    maxDate={moment().year() + '-12-31'}
                    style={{width:270}}
                    onDayPress={(day) => {
                        console.log("day", day)
                        const date = moment(day.dateString);
                        const fdate = date.format('dddd, MMM D');
                        setTitle(fdate)
                        setSelected(day.dateString);
                    }}
                    markedDates={{
                        [selected]: {selected: true, selectedColor: '#0F69FE'}
                    }}
                />
                <View style={styles.bottomContent}>
                    <TouchableOpacity onPress={() => onClose()}><Text style={{color:'#979797', fontSize:16}}>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => onConfirm(selected)} style={styles.chooseBtn}><Text style={{color:'#FFF', fontSize:16}}>Choose date</Text></TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBody:{
        justifyContent:'center', 
        alignItems:'center', 
        height:'100%',
        backgroundColor:'rgba(0, 0, 0, 0.5)'
    },
    calendarTitle:{
        backgroundColor:'#0F69FE', 
        height:50, 
        width:270,
        borderTopLeftRadius:5,
        borderTopEndRadius:5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:16
    },
    bottomContent:{
        width:270, 
        backgroundColor:'#FFF', 
        flexDirection:'row', 
        justifyContent:'flex-end', 
        gap:20,
        paddingTop:10,
        height:60, 
        paddingRight:20,
        borderBottomLeftRadius:5,
        borderBottomEndRadius:5,
    },
    chooseBtn:{
        flexDirection:'row',
        alignItems:'center',
        height:25, 
        paddingHorizontal:20, 
        backgroundColor:'#0F69FE', 
        borderRadius:13,
        justifyContent:'center'
    }
})