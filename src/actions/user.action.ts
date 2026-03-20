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

export async function getUserByClerkId(clerkId: string){
  return prisma.user.findUnique({
    where: {
      clerkId
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        },
      },
    },
  });
}

export async function getDbUserId(){
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
};

export async function getRandomUsers(){
  try {
    const userId = await getDbUserId();

    if (!userId) return [];

    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });

    return randomUsers;
  } catch (error) {
    console.log(error);
  }
}