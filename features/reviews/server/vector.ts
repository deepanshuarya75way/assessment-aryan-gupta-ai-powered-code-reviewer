import type { CodeChunk } from "@/features/reviews/types/review";
import { getPineconeIndex } from "@/features/pinecone/client";
import {extractTerms, fuse, dedupe, type Chunk} from "@/features/pinecone/hybrid";
import {keywordSearch} from "@/features/pinecone/keyword-search";

/** Top 10 similar results */
const CONTEXT_RESULTS = 10;

export function buildPrNamespace(repoFullName: string, prNumber: number) {
  return `${repoFullName.replace("/", "--")}--pr-${prNumber}`;
}

export async function saveChunksToPinecone(
  namespace: string,
  chunks: CodeChunk[],
) {
  const index = getPineconeIndex();

  const records = chunks.map((chunk) => ({
    id: chunk.id,
    text: chunk.text,
    filePath: chunk.filePath,
  }));

  // namespace() scopes vectors so this PR never mixes with repo-wide sync data
  await index.namespace(namespace).upsertRecords({ records });
}

// npx ngrok config add-authtoken 2oQp2VUXGtWILvfWSAlmYXLZxNo_47R1erFFXMmnvJAQbs33H
// npx ngrok http --url=unpreserved-elke-unrefractory.ngrok-free.dev 3000

export async function denseSearch(namespace: string, query: string): Promise<Chunk[]> {
  const index = getPineconeIndex();
  const response = await index.namespace(namespace).searchRecords({
    query: {topK: CONTEXT_RESULTS, inputs: {text:query}},
  });
  const out: Chunk[] = [];
  for(const hit of response.result.hits) {
    const fields = hit.fields as {text?: string; filePath?: string};
    if(!fields.text) continue;
    out.push({id: hit._id, filePath: fields.filePath ?? "", text: fields.text});
  }
  return out;
}

const formatSnippet = (c: Chunk) => `File: ${c.filePath}\n${c.text}`;

export async function searchPrContext(namespace: string, query: string) {
  return (await denseSearch(namespace, query)).map(formatSnippet);
}

export async function searchRepoContextHybrid(
  namespace: string,
  query: string,
  diffText: string,
) {
  const dense = await denseSearch(namespace, query);

  let sparse: Chunk[] = [];
  try {
    sparse = await keywordSearch(namespace, extractTerms(diffText));
  } catch {
    sparse = [];
  }

  const merged = sparse.length ? fuse(dense, sparse) : dense;
  return dedupe(merged).slice(0, CONTEXT_RESULTS).map(formatSnippet);
}
