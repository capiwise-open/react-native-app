import { View } from "react-native"
import { colors } from "../../assets/css/globalStyle"
import { TextInput } from "react-native"
import { TouchableOpacity } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { memo, useState } from "react"

type Prop = {
    onChange?: (txt: string) => void
}

const Searchbar = (props: Prop) => {
    const [txt, setText] = useState("");

    return <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: colors.primaryLight,
        borderRadius: 30,
        paddingHorizontal: 30,
        marginHorizontal: 10,
        marginVertical: 20,
        elevation: 5
    }}>
        <TextInput
            cursorColor="white"
            style={{
                width: '100%',
                height: 50,
                color: 'white',
                borderRadius: 30,
                fontSize: 16,
            }}
            onChangeText={(text) => {
                !!props.onChange && props?.onChange(text);
                setText(text);
            }}
            value={txt}
            placeholderTextColor={'gray'}
            placeholder="Search by title or author"
        />
        <TouchableOpacity onPress={() => {
            if (txt.length > 0) {
                setText("");
                !!props.onChange && props.onChange("");
            }
        }}>
            <FontAwesome name={txt.length > 0 ? "close" : "search"} size={24} color={'white'} />
        </TouchableOpacity>
    </View>
}

export default memo(Searchbar);