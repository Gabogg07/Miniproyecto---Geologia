import React from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import DocForm from "react-cross-form";


const FORM_FIELDS = [
  {
    key: "firstName",
    label: "First Name",
    placeholder: "Peea",
    component: TextInput,
    validators: { presence: { message: "is required" }, length: { minimum: 3 } }
  },
  {
    key: "email",
    label: "Email",
    placeholder: "Type your name...",
    component: TextInput,
    validators: { email: true }
  }
];

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Muestra',
  };

  constructor(props) {
    super(props);
    this.state = {
      form: {
        firstName: null,
        email: null
      },
      isValid: false
    };
    this.onChange = this.onChange.bind(this)
  }
  onChange({updateData}){
    this.setState({ form: updateData })
  }
  render() {
    const { form, isFormValid } = this.state;
    return (
        <View>
        <DocForm
          fields={FORM_FIELDS}
          data={this.state.form}
          onChange={this.onChange}
          validateType="all"
          onValidateStateChanged={({ isValid }) => {
            this.setState({ isFormValid: isValid });
          }}
        />
      </View>
    );
  }
};






const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
