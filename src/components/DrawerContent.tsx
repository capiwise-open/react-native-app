import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { memo, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import { Drawer } from "react-native-paper";

import { AudioBooks, Books, Commodities, Courses, CryptoCurrencies, Currencies, Experts, Podcast } from "../assets/svg";
import DrawerItem from "./DrawerItem";

type DrawerRoutes = '' | 'Audio books' | 'Podcast' | 'Books' | 'Courses' | 'Crypto currencies' | 'Currencies' | 'Commodities' | 'Experts investors' | 'RootStack'

const DrawerContent = (props) => {
  const { state, descriptors, navigation } = props;
  // const navigation = useNavigation<NavigationProp<DrawStackParams>>();
  const [active, setActive] = useState<DrawerRoutes>('');
  const iconSize = 28;

  return <View style={styles.container}>
    {/* header */}
    <View style={styles.header}>
      <Text style={styles.title}>More</Text>
      <TouchableOpacity onPress={() => navigation.closeDrawer()}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
    {/* section */}
    <View style={styles.section}>
      <DrawerItem label={"Audio books"} icon={<AudioBooks width={iconSize} height={iconSize} color={active === "Audio books" ? "#2EBD85" : "white"}/>}
        onPressIn={() => setActive("Audio books")}
        onPressOut={() => setActive("")}
        onPress={() => navigation.navigate("AudiobookStack")} />
      <DrawerItem label={"Podcast"} icon={<Podcast width={iconSize} height={iconSize} color={active === "Podcast" ? "#2EBD85" : "white"}/>}
        onPressIn={() => setActive("Podcast")}
        onPressOut={() => setActive("")}
        onPress={() => navigation.navigate("PodcastStack")} />
      <DrawerItem label={"Books"} icon={<Books width={iconSize} height={iconSize} color={active === "Books" ? "#2EBD85" : "white"}/>}
        onPressIn={() => setActive("Books")}
        onPressOut={() => setActive("")}
        onPress={() => navigation.navigate("BookStack")} />
      <DrawerItem label={"Courses"} icon={<Courses width={iconSize} height={iconSize} color={active === "Courses" ? "#2EBD85" : "white"}/>}
        onPressIn={() => setActive("Courses")}
        onPressOut={() => setActive("")}
        onPress={() => navigation.navigate("CourseStack")} />
      <DrawerItem label={"Crypto currencies"} icon={<CryptoCurrencies width={iconSize} height={iconSize} color={active === "Crypto currencies" ? "#2EBD85" : "white"}/>}
        onPressIn={() => setActive("Crypto currencies")}
        onPressOut={() => setActive("")}
        onPress={() => navigation.navigate("CryptoCurrencies")} />
      <DrawerItem label={"Currencies"} icon={<Currencies width={iconSize} height={iconSize} color={active === "Currencies" ? "#2EBD85" : "white"}/>}
        onPressIn={() => setActive("Currencies")}
        onPressOut={() => setActive("")}
        onPress={() => navigation.navigate("Currencies")} />
      <DrawerItem label={"Commodities"} icon={<Commodities width={iconSize} height={iconSize} color={active === "Commodities" ? "#2EBD85" : "white"}/>}
        onPressIn={() => setActive("Commodities")}
        onPressOut={() => setActive("")}
        onPress={() => navigation.navigate("Commodities")} />
      <DrawerItem label={"Experts investors"} icon={<Experts width={iconSize} height={iconSize} color={active === "Experts investors" ? "#2EBD85" : "white"}/>}
        onPressIn={() => setActive("Experts investors")}
        onPressOut={() => setActive("")}
        onPress={() => navigation.navigate("InvestorStack")} />
    </View>
  </View>
}

export default memo(DrawerContent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B1620',
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 40,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 24,
    color: 'white'
  },
  section: {
    marginHorizontal: 5,
    marginTop: 40,
    flexDirection: 'column',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#464646'
  },
  itemLabel: {
    color: 'white',
    fontSize: 14,
    paddingLeft: 14,
  }
})