import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // Change to column to stack items vertically
    backgroundColor: "#040B11",
    padding: 20,
  },
  profilePictureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  initialsContainer: {
    width: 74,
    height: 74,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  initials: {
    fontSize: 35,
    color: "#FFF",
    fontWeight:"700"
  },
   profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 10,
    color: "#FFF",
  },
  profile: {
    fontSize: 16,
    color: "#2EBD85",
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap:10,
    marginTop: 15,
  },
  sectionIcon: {
    width:14,
    height:14
  },
  sectionText: {
    fontSize: 16,
    color: "#FFF",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#464646",
    marginTop: 15,
  },
});

export default styles;
