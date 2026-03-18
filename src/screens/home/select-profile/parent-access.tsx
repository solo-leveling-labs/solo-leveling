import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { StyleSheet, Text, View } from "react-native";

const ParentAccessScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Parent Access</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.raleway.extraBold,
    fontSize: 32,
    color: colors.accent.mainBlue,
  },
});

export default ParentAccessScreen;
