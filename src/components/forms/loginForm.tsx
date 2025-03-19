import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios"
import { BASEURL } from "../../utils/constant";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const MutateLogin = useMutation({
        mutationFn: async () => {
            const resp = await axios.post(`${BASEURL}/auth/login`, form.getValues())
            return resp.data
        }, onSuccess: (data) => {
            if (data.success) {
                toast.success("Login successful")
                localStorage.setItem("token", data.message)
                navigate(`/dashboard`)
            } else {
                toast.error(data.message)
            }
        }
        ,
        onError: (error: any) => {
            toast.error(error.response.data.message)
        }
    })


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    }

    return (
        <div className="flex w-full items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
            <motion.div className="w-full max-w-md" initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants} className="mb-6 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <LogIn className="h-6 w-6 text-primary-foreground" />
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="border-none shadow-lg">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-center text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                            <CardDescription className="text-center">
                                Enter your credentials to sign in to your account
                            </CardDescription>
                        </CardHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(() => {
                                MutateLogin.mutate()
                            })}>
                                <CardContent className="space-y-4">
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                        <FormControl>
                                                            <Input
                                                                placeholder="name@example.com"
                                                                type="email"
                                                                autoCapitalize="none"
                                                                autoComplete="email"
                                                                autoCorrect="off"
                                                                className="pl-10"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel>Password</FormLabel>
                                                    </div>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                        <FormControl>
                                                            <Input type={showPassword ? "text" : "password"} className="pl-10 pr-10" {...field} />
                                                        </FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                                        </Button>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4">
                                    <motion.div
                                        variants={itemVariants}
                                        className="w-full"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button type="submit" className="w-full mt-2 " disabled={MutateLogin.isPending}>
                                            {MutateLogin.isPending ? (
                                                <>
                                                    <svg
                                                        className="mr-2 h-4 w-4 animate-spin"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Signing in...
                                                </>
                                            ) : (
                                                "Sign in"
                                            )}
                                        </Button>
                                    </motion.div>
                                </CardFooter>
                                <p className="text-center">
                                    Dont have an account? <Link to={"/register"} >Register</Link>
                                </p>
                            </form>
                        </Form>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    )
}
