import React, { memo, useRef } from "react";
import {
    View,
    Image,
    Dimensions,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import CircularProgress, { ProgressRef } from 'react-native-circular-progress-indicator';


const Loading = (props: {
    complete?: () => void
}) => {
    const progressRef = useRef<ProgressRef>(null);

    return (
        <View style={{
            flex: 1, justifyContent: 'center', position: 'relative', alignItems: 'center'
        }}>
            {/* <ActivityIndicator size={100} color="#fff" animating={true} theme={}/> */}
            <CircularProgress ref={progressRef}
                onAnimationComplete={() => {
                    !!props.complete && props.complete()
                    // progressRef.current?.reAnimate()
                }}
                value={100} duration={3000} progressValueColor="white" showProgressValue={false} activeStrokeColor="white" activeStrokeWidth={5} />
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 100,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                }}>
                <View style={{
                    backgroundColor: '#040B1100',
                    width: 80,
                    height: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 40,
                }}>
                    <Image
                        source={require("../../assets/img/logo.png")}
                        tintColor={"#fff"}
                        style={{ width: 53, height: 53, marginLeft: -8 }}
                    />
                </View>
            </View>
        </View>
    )
}

export default memo(Loading);