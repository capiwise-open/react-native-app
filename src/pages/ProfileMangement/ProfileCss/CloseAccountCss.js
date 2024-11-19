import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#040B11",
    padding: 20,
  },
  profilePictureContainer: {
    flexDirection: "row", // Change to column to stack items vertically
    alignItems: "center",
  },
  profileDetails: {
    alignItems: "left", // Center the text horizontally
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
    color: "#FFF",
  },
  profile: {
    fontSize: 14,
    color: "#979797",
    marginBottom: 30,
  },
  optionsContainer: {
    width:"100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'center'
  },
  leftText: {
    fontSize: 16,
    color: "#FFF",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioLabel: {
    fontSize: 16,
    color: "#FFF",
  },
});

export default styles;
