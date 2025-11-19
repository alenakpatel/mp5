"use server";

import getCollection, { POSTS_COLLECTION } from "@/mongodb";
import { URLProps } from "@/types";

export async function createNewAlias(
    url: string,
    alias: string
): Promise<{ success: boolean; alias?: string; error?: string }> {
    console.log("Creating new alias");
    let collection;
    try {
        console.log("try");

        collection = await getCollection(POSTS_COLLECTION);

        console.log("now");

        if (!alias) {
            return {
                success: false,
                error: "Please provide an alias",
            };
        }

        console.log("now1");

        // Validate alias format
        if (!/^[a-zA-Z0-9-]+$/.test(alias)) {
            return {
                success: false,
                error: "Alias can only contain letters, numbers, and hyphens",
            };
        }

        // Check if alias already exists
        const existing = await collection.findOne({ alias });

        console.log("now2");

        if (existing) {
            return {
                success: false,
                error: "This alias is already taken. Please choose another one.",
            };
        }

        // Create the URL document
        const urlDoc: URLProps = {
            alias,
            url,
        };

        console.log("now3");

        await collection.insertOne(urlDoc);

        console.log("now4");

        return {
            success: true,
            alias,
        };
    } catch (error) {
        console.error("Error creating alias:", error);
        return {
            success: false,
            error: "Failed to create short URL. Please try again.",
        };
    }
}