"use client";
import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SignIn from "./auth/signin/page";
import Dashboard from "./dashboard/page";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/signin");

  return null;
}
