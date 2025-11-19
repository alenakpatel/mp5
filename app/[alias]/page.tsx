import { redirect } from 'next/navigation';
import getCollection, { POSTS_COLLECTION } from "@/mongodb";

export default async function RedirectPage({params,}: { params: Promise<{ alias: string }> }) {
    const { alias } = await params;

    const collection = await getCollection(POSTS_COLLECTION);
    const result = await collection.findOne({ alias: alias });

    if (result && result.url) {
        redirect(result.url);
    }

    redirect('/');
}