import React, { createRef, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { WebView } from "react-native-webview";
import { Snackbar } from "react-native-paper";

let user = "";
let pwd = "";
const inputUser = createRef();
const inputPwd = createRef();
const btnSign = createRef();
function Login({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [hidePwd, sethidePwd] = useState(true);
  const [errorAuth, setErrorAuth] = useState("");
  const [focus, setFocus] = useState(true);

  return (
    <ImageBackground
      source={{
        uri: "https://www.xtrafondos.com/wallpapers/cubos-3d-neon-3313.jpg",
      }}
      style={styles.bg}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <Image style={styles.imagen} source={require("./assets/logo2.png")} />
          <Input
            ref={inputUser}
            containerStyle={styles.nombre}
            inputContainerStyle={styles.inputStyle}
            inputStyle={{ color: "white" }}
            placeholder="user@gmail.com"
            leftIcon={
              <Icon
                name="user"
                size={24}
                color={focus == true ? "white" : "grey"}
                style={{ marginRight: 5 }}
              />
            }
            onChangeText={function (text) {
              user = text;
            }}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
          />
          <Input
            ref={inputPwd}
            secureTextEntry={hidePwd}
            inputStyle={{ color: "white" }}
            containerStyle={styles.correo}
            inputContainerStyle={styles.inputStyle}
            placeholder="Password"
            leftIcon={
              <Icon
                name={hidePwd == true ? "lock" : "unlock"}
                size={24}
                color="grey"
                style={{ marginRight: 5 }}
                onPress={() => {
                  sethidePwd(!hidePwd);
                }}
              />
            }
            onChangeText={function (text) {
              pwd = text;
            }}
          />
          <Button
            containerStyle={styles.boton}
            ref={btnSign}
            buttonStyle={{
              width: 350,
              height: "100%",
            }}
            titleStyle={{
              fontSize: 20,
            }}
            loading={loading}
            title="Sign In"
            onPress={async function () {
              setLoading(true);
              const response = await fetch(
                "http://devapi.doktuz.com:8080/goambu/api/v2/auth/",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username: user,
                    password: pwd,
                  }),
                }
              );
              response.json().then((data) => {
                setLoading(false);
                console.log(data);
                if (data.currentStatus == "ACTIVE") {
                  inputUser.current.clear();
                  inputPwd.current.clear();
                  navigation.navigate("Tawkto");
                } else {
                  inputUser.current.clear();
                  inputPwd.current.clear();
                  setShowSnack(true);
                  setLoading(false);
                  setErrorAuth(data.message);
                }
              });
            }}
          />
          <Snackbar
            visible={showSnack}
            onDismiss={() => setShowSnack(false)}
            duration={4000}
            action={{
              label: "Ok",
              onPress: () => {
                // Do something
              },
            }}
          >
            {errorAuth}
          </Snackbar>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

function Tawkto({ navigation }) {
  const injectJS = `
  var Tawk_API=Tawk_API||{};
  Tawk_API.visitor = {
  name : ${user},
  email : ${user},
  };
  
  var Tawk_LoadStart=new Date();
  
    
    `;

  return (
    <>
      <Button
        title="Log Out"
        buttonStyle={{ backgroundColor: "red" }}
        onPress={async function () {
          const response = await fetch(
            "http://devapi.doktuz.com:8080/goambu/api/v2/auth/logout"
          );
          console.log(response.text());
          navigation.navigate("Login");
        }}
      />
      <WebView
        source={{
          uri: "https://tawk.to/chat/5f6acdfff0e7167d0012e24c/default",
        }}
        injectedJavaScriptBeforeContentLoaded={injectJS}
      />
    </>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Tawkto"
          component={Tawkto}
          options={{
            headerLeft: null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/5f6acdfff0e7167d0012e24c/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  imagen: {
    height: 250,
    resizeMode: "contain",
    width: 280,
    marginBottom: 50,
  },
  nombre: {
    padding: 10,
    alignItems: "center",
  },
  correo: {
    padding: 10,
    alignItems: "center",
  },
  boton: {
    height: 50,
  },
  inputStyle: {
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    width: "90%",
  },
  bg: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default App;
