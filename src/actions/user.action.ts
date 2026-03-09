"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser(){
  try {

    const userData = await auth();
    const user = await currentUser();

    if(!userData.userId || !user){
      return null;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userData.userId
      }
    })

    if(existingUser){
      return existingUser;
    };

    await prisma.user.create({
      data: {
        clerkId: userData.userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    })

  } catch (error) {
    console.log(error);
  }
}