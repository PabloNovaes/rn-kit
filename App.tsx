"use client"

import { useState } from "react"
import { ScrollView, View, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Button } from "./components/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./components/Card"
import { Input } from "./components/Input"

export default function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      Alert.alert("Success", "Login successful!")
    }, 2000)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </CardContent>
        <CardFooter>
          <Button title="Sign In" onPress={handleLogin} loading={loading} style={{ flex: 1 }} />
        </CardFooter>
      </Card>

      <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
        <Button title="Default" style={{ flex: 1 }} />
        <Button title="Outline" variant="outline" style={{ flex: 1 }} />
      </View>

      <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
        <Button title="Ghost" variant="ghost" style={{ flex: 1 }} />
        <Button title="Destructive" variant="destructive" style={{ flex: 1 }} />
      </View>

      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <Button title="Small" size="sm" />
        <Button title="Default" />
        <Button title="Large" size="lg" />
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  )
}
