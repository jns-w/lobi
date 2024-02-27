"use client"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import * as z from "zod"
import {FormMessage} from "@/components/ui/form";

export default function Account() {

  const signInSchema = z.object({
    username: z.string()
      .min(3,
        {message: "Username must be at least 3 characters long"}
      ).max(20,
        {message: "Username must be at most 20 characters long"}
      ),
    email: z.string().email({message: "Invalid email address"}),
    password: z.string()
      .min(8,
        {message: "Password must be at least 8 characters long"}
      ).max(20,
        {message: "Password must be at most 20 characters long"}
      ),
  })

  const createAccountSchema = z.object({
    username: z.string()
      .min(3,
        {message: "Username must be at least 3 characters long"}
      ).max(20,
        {message: "Username must be at most 20 characters long"}
      ),
    email: z.string().email({message: "Invalid email address"}),
    password: z.string()
      .min(8,
        {message: "Password must be at least 8 characters long"}
      ).max(20,
        {message: "Password must be at most 20 characters long"}
      ),
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Tabs defaultValue="sign in" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign in">Sign in</TabsTrigger>
          <TabsTrigger value="create account">Create account</TabsTrigger>
        </TabsList>
        <TabsContent value="sign in">
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Welcome back! Sign in to your account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Username or Email</Label>
                <Input id="name" placeholder="pedro.blanca@gmail.com"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••"/>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="create account">
          <Card>
            <CardHeader>
              <CardTitle>Create account</CardTitle>
              <CardDescription>
                Join us! Create your account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Username or Email</Label>
                <Input id="name" placeholder="pedro.blanca@gmail.com"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" placeholder="••••••"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" type="password" placeholder="••••••"/>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
