
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Store, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Define schema for dealer registration
const dealerFormSchema = z.object({
  name: z.string().min(2, "Dealership name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zip: z.string().min(4, "ZIP code must be at least 4 characters"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

type DealerFormValues = z.infer<typeof dealerFormSchema>;

const DealerRegistration = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<DealerFormValues>({
    resolver: zodResolver(dealerFormSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      website: "",
      description: "",
    },
  });

  React.useEffect(() => {
    // If the user is not authenticated, redirect to login
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to register as a dealer",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(values: DealerFormValues) {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to register as a dealer",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First update user's role in profiles table using upsert to handle both new and existing profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          role: "dealer" 
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Then register dealer information
      const { error: dealerError } = await supabase.from("dealers").insert({
        user_id: user.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        website: values.website || null,
        description: values.description || null,
        status: 'Pending'
      });

      if (dealerError) throw dealerError;

      toast({
        title: "Registration successful",
        description: "Your dealer application has been submitted for review",
      });

      // Redirect to dealer dashboard or homepage
      navigate("/dealer/dashboard");
    } catch (error: any) {
      console.error("Error registering dealer:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register as a dealer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Register as a Dealer</CardTitle>
            <CardDescription>
              Join our network of trusted car dealers and start selling on our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dealership Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Example Motors" {...field} />
                      </FormControl>
                      <FormDescription>
                        The official name of your dealership.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Contact email for your dealership.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormDescription>
                          A phone number where customers can reach you.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="California" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP/Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="90210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your dealership's website, if you have one.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your dealership..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of your dealership and services.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
              {!isSubmitting && <UserPlus className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default DealerRegistration;
