import {prisma} from "@/lib/db";
import type {Chunk} from "./hybrid";
import { Rows } from "lucide-react";

const SPARSE_RESULTS = 5;

export async function keywordSearch(namespace: string, terms: string[]): Promise<Chunk[]> {
  if(terms.length === 0) return [];
  const rows = await prisma.repoChunk.findMany({
    where: {namespace, OR: terms.map((t) => ({text: {contains:t}}))},
    take: 50,
  });
  const score = (s: string) => terms.filter((t) => s.includes(t)).length;
  return rows
            .map((r) => ({id:r.id, filePath: r.filePath, text: r.text}))
            .sort((a,b) => score(b.text) - score(a.text))
            .slice(0, SPARSE_RESULTS);
}
